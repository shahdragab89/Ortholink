# backend/test_flask.py
from app import create_app

app = create_app()

# Test the app directly
with app.test_client() as client:
    # Test home route
    response = client.get('/')
    print(f"Home route (/): Status {response.status_code}")
    print(f"Response: {response.get_json()}")
    
    # Test health route
    response = client.get('/api/health')
    print(f"\nHealth route (/api/health): Status {response.status_code}")
    print(f"Response: {response.get_json()}")
    
    # Test auth route
    response = client.get('/api/auth/test')
    print(f"\nAuth test route (/api/auth/test): Status {response.status_code}")
    print(f"Response: {response.get_data(as_text=True)}")