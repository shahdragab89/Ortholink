# test_radiologist.py
import requests
import json

# 1. Login
login_url = "http://127.0.0.1:5000/api/auth/login"
login_data = {
    "email": "btabt@ortholink.com",
    "password": "radiologist123"
}

print("=" * 60)
print("1. LOGIN TEST")
print("=" * 60)
response = requests.post(login_url, json=login_data)
print(f"Status Code: {response.status_code}")
login_result = response.json()
print("Login Response:", json.dumps(login_result, indent=2))

if response.status_code == 200:
    token = login_result["access_token"]
    user_id = login_result["user_id"]
    
    print(f"\nExtracted user_id: {user_id}")
    print(f"Token length: {len(token)}")
    
    # 2. Get profile
    print("\n" + "=" * 60)
    print("2. GET PROFILE TEST")
    print("=" * 60)
    profile_url = f"http://127.0.0.1:5000/api/auth/radiologist/{user_id}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    print(f"Request URL: {profile_url}")
    print(f"Headers: Authorization: Bearer {token[:50]}...")
    
    profile_response = requests.get(profile_url, headers=headers)
    print(f"\nProfile Status Code: {profile_response.status_code}")
    
    try:
        profile_result = profile_response.json()
        print("Profile Response:", json.dumps(profile_result, indent=2))
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        print("Raw Response:", profile_response.text)
    
    # 3. Test PUT update
    print("\n" + "=" * 60)
    print("3. UPDATE PROFILE TEST")
    print("=" * 60)
    update_data = {
        "phone": "+20 987 654 3210",
        "address": "Alexandria, Egypt"
    }
    
    print(f"Update Data: {update_data}")
    update_response = requests.put(profile_url, headers=headers, json=update_data)
    print(f"Update Status Code: {update_response.status_code}")
    
    try:
        update_result = update_response.json()
        print("Update Response:", json.dumps(update_result, indent=2))
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        print("Raw Response:", update_response.text)
    
    # 4. Get profile again to verify update
    print("\n" + "=" * 60)
    print("4. VERIFY UPDATE")
    print("=" * 60)
    verify_response = requests.get(profile_url, headers=headers)
    print(f"Verify Status Code: {verify_response.status_code}")
    
    try:
        verify_result = verify_response.json()
        print("Updated Profile:", json.dumps(verify_result, indent=2))
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        print("Raw Response:", verify_response.text)
else:
    print("Login failed!")

print("\n" + "=" * 60)
print("TEST COMPLETE")
print("=" * 60)