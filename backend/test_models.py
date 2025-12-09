import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_models_individually():
    """Test each model separately to isolate issues"""
    
    print("Testing models individually...\n")
    
    # Test 1: Import and test User model
    try:
        from app.models.user import User
        print("✅ User model imported successfully")
        print(f"   Table name: {User.__tablename__}")
        print(f"   Columns: {[c.key for c in User.__table__.columns]}")
    except Exception as e:
        print(f"❌ User model error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "="*50 + "\n")
    
    # Test 2: Import and test Patient model  
    try:
        from app.models.patient import Patient
        print("✅ Patient model imported successfully")
        print(f"   Table name: {Patient.__tablename__}")
        print(f"   Columns: {[c.key for c in Patient.__table__.columns]}")
    except Exception as e:
        print(f"❌ Patient model error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "="*50 + "\n")
    
    # Test 3: Import and test Staff model
    try:
        from app.models.staff import Staff
        print("✅ Staff model imported successfully")
        print(f"   Table name: {Staff.__tablename__}")
        print(f"   Columns: {[c.key for c in Staff.__table__.columns]}")
    except Exception as e:
        print(f"❌ Staff model error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "="*50)
    print("✅ All basic models imported successfully!")
    return True

if __name__ == "__main__":
    test_models_individually()