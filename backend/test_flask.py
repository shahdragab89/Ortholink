# backend/test_flask.py
from app import create_app
import json

app = create_app()

with app.test_client() as client:
    print("=== Testing Flask App ===")
    
    # Test home route
    response = client.get('/')
    print(f"\n1. Home route (/): Status {response.status_code}")
    print(f"   Response: {response.get_json()}")
    
    # Test health route
    response = client.get('/api/health')
    print(f"\n2. Health route (/api/health): Status {response.status_code}")
    print(f"   Response: {response.get_json()}")
    
    # Test login with POST data
    print(f"\n3. Testing Login (/api/auth/login)")
    
    # Try different test credentials
    test_logins = [
        {"email": "admin@example.com", "password": "admin123"},
        {"email": "baty@example.com", "password": "baty123"},
        {"email": "test@example.com", "password": "password"}
    ]
    
    for i, credentials in enumerate(test_logins, 1):
        print(f"\n   Attempt {i}: {credentials['email']}")
        response = client.post(
            '/api/auth/login',
            data=json.dumps(credentials),
            content_type='application/json'
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.get_json()}")