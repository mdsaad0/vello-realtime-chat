import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader2} from 'lucide-react'; 
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import { toast } from 'react-hot-toast';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => { 
    const { fullName, email, password } = formData;
    if(!fullName.trim()) return toast.error("Full Name is required");
    if(!email.trim()) return toast.error("Email is required");
    if(!/\S+@\S+\.\S+/.test(email)) return toast.error("Invalid email format");
    if(!password) return toast.error("Password is required");
    if(password.length < 6) return toast.error("Password must be at least 6 characters long");

    // If all validations pass, return true
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if(success=== true) {
      signup(formData);
    }
  }


  return (
    <div className=" grid lg:grid-cols-2 ">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-2 sm:p-10">
        <div className="w-full max-w-md space-y-2">
          {/* LOGO */}
          <div className="text-center mb-3 mt-9">
            <div className="flex flex-col items-center group">
              <div className="size-12 rounded-xl mt-8 bg-primary/10 flex items-center justify-center group-hover:bg-primary/20  transition-colors ">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">
                Get started with your free account
              </p>
            </div>
          </div>
          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label mb-1">
                <span className='label-text font-medium'>Full Name</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <User className=" size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label mb-1.5">
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <Mail className=" size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label ">
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                  <Lock className=" size-5 text-base-content/40 z-10" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/40 hover:text-base-content cursor-pointer z-10 " 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {
                    showPassword?(
                      <EyeOff className='size-5' />
                    ) : (
                      <Eye className='size-5' />
                    )
                  }
                </button>
              </div>
            </div>

            <button type='submit' className='btn btn-soft btn-primary w-full ' disabled={isSigningUp}>
              
              {isSigningUp ? (
                <>
                  <Loader2 className='size-5 animate-spin'/>
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className='text-center '>
            <p className='text-base-content/60 '>
              Already have an account? {" "}
              <Link to="/login" className="link link-primary">
              Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}


      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />

    </div>
  );
};

export default SignUpPage

// 👉🏽showPassword is a state variable that stores a boolean value (true or false).
//false means the password is hidden (usually shown as dots •••••).
//true means the password is visible (plain text like mypassword123).
//setShowPassword is a function used to update the value of showPassword.
//useState(false) initializes the state with the value false (so the password is hidden by default).


// 👉🏽formData is an object that holds the user's input data for signing up.
//It has three properties: fullName, email, and password.
//setFormData is a function used to update the formData state.
//useState({}) initializes the state with an empty object (so the form is initially empty).
//formData.fullName, formData.email, and formData.password are the individual properties of the formData object.
//setFormData({}) updates the formData state with an empty object (so the form is cleared).
// This is useful for managing user input in a sign-up form, where users enter their full name, email, and password.


/*🧠 Imagine a form:
You have a textbox that asks:
✏️ "What is your name?"
🧍‍♂️ You type:
"John"
Behind the scenes, this happens in 3 steps:
🧠 onChange saves "John" in memory (called formData.fullName)
🪞 value shows what’s in memory inside the box → so "John" appears in the textbox
📌 The textbox now has "John" inside it because it’s the saved value
*/ 