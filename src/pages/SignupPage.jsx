import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, BookOpen, Eye, PenTool } from "lucide-react";
import toast from "react-hot-toast";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const SignupPage = () => {
  const [formData, setFormData] = useState({name: "", email: "", password: "", role: "viewer"});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>{
     setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData);
      const { token } = response.data;
      // Fetch profilo to get user details
      const profileResponse = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      login(profileResponse.data, token);
      toast.success("Account created successfully!");
      
      // Redirect based on role
      if (profileResponse.data.role === 'writer' || profileResponse.data.role === 'superadmin') {
        navigate("/dashboard");
      } else {
        navigate("/writers");
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
  <div className="w-full max-w-md">
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-400 to-violet-500 rounded-full mb-4 shadow-md">
        <BookOpen className="w-8 h-8 text-white"/>
      </div>
      <h1 className="text-3xl font-bold text-slate-900">Create an Account</h1>
      <p className="text-slate-600 mt-2">Start your journey of creating amazing eBooks today.</p>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Full Name"
          name="name"
          type="text"
          placeholder="John Doe"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          required/>

          <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          required/>

                    <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Minimum 6 Characters"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          required/>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "viewer"})}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  formData.role === "viewer"
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 hover:border-violet-300"
                }`}
              >
                <Eye className={`w-6 h-6 ${formData.role === "viewer" ? "text-violet-600" : "text-gray-500"}`} />
                <div className="text-center">
                  <p className={`text-sm font-medium ${formData.role === "viewer" ? "text-violet-900" : "text-gray-900"}`}>Viewer</p>
                  <p className="text-xs text-gray-500 mt-1">Browse and read eBooks</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "writer"})}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  formData.role === "writer"
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 hover:border-violet-300"
                }`}
              >
                <PenTool className={`w-6 h-6 ${formData.role === "writer" ? "text-violet-600" : "text-gray-500"}`} />
                <div className="text-center">
                  <p className={`text-sm font-medium ${formData.role === "writer" ? "text-violet-900" : "text-gray-900"}`}>Writer</p>
                  <p className="text-xs text-gray-500 mt-1">Create and manage eBooks</p>
                </div>
              </button>
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Create Account
          </Button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-8">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700">
        Sign in
        </Link>
      </p>
    </div>
  </div>
</div>
  )
}

export default SignupPage