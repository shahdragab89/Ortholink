# backend/test_app.py
import sys
print("Python version:", sys.version)

try:
    from app import create_app
    print("✓ Successfully imported create_app")
    
    app = create_app()
    print("✓ Successfully created app")
    
    with app.app_context():
        print("✓ App context created successfully")
        
    print("\n✅ Flask app is ready to run!")
    print("Run: python run.py")
    
except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()