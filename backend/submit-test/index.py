import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Save test results to database and send email notification to admin
    Args: event with httpMethod, body containing firstName, lastName
          context with request_id
    Returns: HTTP response with success status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    first_name = body_data.get('firstName', '')
    last_name = body_data.get('lastName', '')
    
    if not first_name or not last_name:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'firstName and lastName are required'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    admin_email = os.environ.get('ADMIN_EMAIL')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        "INSERT INTO test_results (first_name, last_name, score, total_questions) VALUES (%s, %s, %s, %s) RETURNING id, completed_at",
        (first_name, last_name, 5, 5)
    )
    result = cursor.fetchone()
    test_id = result['id']
    completed_at = result['completed_at']
    
    cursor.execute(
        "SELECT first_name, last_name, completed_at, score, total_questions FROM test_results ORDER BY completed_at DESC LIMIT 20"
    )
    all_results = cursor.fetchall()
    
    conn.commit()
    cursor.close()
    conn.close()
    
    try:
        send_email_notification(first_name, last_name, completed_at, all_results, admin_email)
    except Exception as e:
        print(f"Email sending failed: {e}")
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'testId': test_id,
            'message': 'Test results saved successfully'
        }),
        'isBase64Encoded': False
    }


def send_email_notification(first_name: str, last_name: str, completed_at, all_results, admin_email: str):
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    
    if not all([smtp_host, smtp_user, smtp_password, admin_email]):
        print("SMTP configuration incomplete, skipping email")
        return
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новый результат теста: {first_name} {last_name}'
    msg['From'] = smtp_user
    msg['To'] = admin_email
    
    table_rows = ""
    for idx, row in enumerate(all_results, 1):
        completed_time = row['completed_at'].strftime('%d.%m.%Y %H:%M') if hasattr(row['completed_at'], 'strftime') else str(row['completed_at'])
        table_rows += f"""
        <tr style="{'background-color: #e0f7fa;' if idx == 1 else 'background-color: #ffffff;'}">
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">{idx}</td>
            <td style="padding: 12px; border: 1px solid #ddd;">{row['first_name']} {row['last_name']}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">{completed_time}</td>
            <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">{row['score']}/{row['total_questions']}</td>
        </tr>
        """
    
    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #7c3aed; border-bottom: 3px solid #7c3aed; padding-bottom: 10px;">
            ✅ Тест пройден!
          </h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Студент:</strong> {first_name} {last_name}</p>
            <p style="margin: 10px 0;"><strong>Дата и время:</strong> {completed_at.strftime('%d.%m.%Y в %H:%M') if hasattr(completed_at, 'strftime') else str(completed_at)}</p>
            <p style="margin: 10px 0;"><strong>Результат:</strong> 5/5 ✓</p>
          </div>
          
          <h3 style="color: #4b5563; margin-top: 30px;">Последние 20 результатов:</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background-color: #7c3aed; color: white;">
                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">#</th>
                <th style="padding: 12px; border: 1px solid #ddd;">Имя и фамилия</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Дата прохождения</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Результат</th>
              </tr>
            </thead>
            <tbody>
              {table_rows}
            </tbody>
          </table>
          
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            Это автоматическое уведомление от системы тестирования "Агент 7-В"
          </p>
        </div>
      </body>
    </html>
    """
    
    html_part = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(html_part)
    
    server = smtplib.SMTP(smtp_host, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.send_message(msg)
    server.quit()
