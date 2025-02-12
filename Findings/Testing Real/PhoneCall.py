from twilio.rest import Client

# Twilio credentials (replace with your actual values)
account_sid = 'your_account_sid'
auth_token = 'your_auth_token'
twilio_number = 'your_twilio_phone_number'
recipient_number = 'recipient_phone_number'

# Create Twilio client
client = Client(account_sid, auth_token)

# Make the call
call = client.calls.create(
    to=recipient_number,
    from_=twilio_number,
    twiml='<Response><Say>Hello, this is a test call from Python using Twilio!</Say></Response>'
)

print(f"Call initiated with SID: {call.sid}")
