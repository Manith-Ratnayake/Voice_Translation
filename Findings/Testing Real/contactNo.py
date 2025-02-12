import phonenumbers
from phonenumbers import geocoder, carrier, timezone

def extract_phone_number_details(phone_number: str):
    try:
        # Parse the phone number
        parsed_number = phonenumbers.parse(phone_number)
        
        # Validate the phone number
        if not phonenumbers.is_valid_number(parsed_number):
            return {"Error": "Invalid phone number"}
        
        # Get the country name
        country_name = geocoder.description_for_number(parsed_number, "en")
        
        # Get the carrier (network provider)
        phone_carrier = carrier.name_for_number(parsed_number, "en")
        
        # Get the time zone(s)
        phone_timezones = timezone.time_zones_for_number(parsed_number)
        
        # Get the country code
        country_code = parsed_number.country_code
        
        return {
            "Phone Number": phone_number,
            "Country": country_name,
            "Country Code": country_code,
            "Carrier": phone_carrier,
            "Time Zones": list(phone_timezones),
        }
    except phonenumbers.NumberParseException as e:
        return {"Error": str(e)}


if __name__ == "__main__":
    phone_number = input("Enter the phone number : ")
    details = extract_phone_number_details(phone_number)
    for key, value in details.items():
        print(f"{key}: {value}")
