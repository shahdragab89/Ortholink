# test_staff_data.py
import requests
import json

# Login first
login_url = "http://127.0.0.1:5000/api/auth/login"
login_data = {
    "email": "btabt@ortholink.com",
    "password": "radiologist123"
}

print("1. Logging in...")
response = requests.post(login_url, json=login_data)
print(f"Status Code: {response.status_code}")

if response.status_code == 200:
    login_result = response.json()
    token = login_result["access_token"]
    user_id = login_result["user_id"]
    
    print(f"User ID: {user_id}")
    print(f"Token: {token[:50]}...")
    
    # Get profile
    profile_url = f"http://127.0.0.1:5000/api/auth/radiologist/{user_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"\n2. Getting profile from: {profile_url}")
    profile_response = requests.get(profile_url, headers=headers)
    print(f"Status Code: {profile_response.status_code}")
    
    if profile_response.status_code == 200:
        profile_data = profile_response.json()
        print("\nProfile Data Structure:")
        print("=" * 60)
        for key, value in profile_data.items():
            print(f"{key}: {value}")
        print("=" * 60)
        
        # Check if staff fields are present
        staff_fields = ['staff_id', 'license_number', 'department', 'hire_date', 'salary']
        print("\nStaff-specific fields:")
        for field in staff_fields:
            if field in profile_data:
                print(f"✓ {field}: {profile_data[field]}")
            else:
                print(f"✗ {field}: NOT FOUND")
    else:
        print(f"Error: {profile_response.text}")
else:
    print("Login failed!")