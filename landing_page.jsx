import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Upload, Loader } from 'lucide-react';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzKlItTwDFEcI9RziPR13tiv4MnwVdd9MuxI2NZp122Gjhq6wYbZc5tdDQZaAIqYfD1CQ/exec";

const DEPARTMENTS = [
  { id: "cse", name: "Computer Science & Engineering", code: "CSE" },
  { id: "it", name: "Information Technology", code: "IT" },
  { id: "ece", name: "Electronics & Communication", code: "ECE" },
  { id: "eee", name: "Electrical & Electronics", code: "EEE" }
];

const CERTIFICATE_TYPES = [
  "Academic",
  "Sports",
  "Cultural",
  "Technical",
  "Internship",
  "Workshop",
  "Other"
];

export default function LandingPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    certificateType: "",
    department: ""
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.rollNumber.trim()) newErrors.rollNumber = "Roll number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.certificateType) newErrors.certificateType = "Certificate type is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (uploadedFiles.length === 0) newErrors.uploadedFiles = "Please upload at least one certificate";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2),
      type: file.type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    if (errors.uploadedFiles) {
      setErrors(prev => ({ ...prev, uploadedFiles: "" }));
    }
  };

  // Remove uploaded file
  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: "error", text: "Please fix the errors above" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        fullName: formData.fullName,
        rollNumber: formData.rollNumber,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phone: formData.phone,
        certificateType: formData.certificateType,
        department: formData.department
      };

      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (result.status === "success") {
        setMessage({
          type: "success",
          text: "✓ Form submitted successfully! Your certificates have been recorded."
        });
        // Reset form
        setFormData({
          fullName: "",
          rollNumber: "",
          dateOfBirth: "",
          email: "",
          phone: "",
          certificateType: "",
          department: ""
        });
        setUploadedFiles([]);
      } else {
        setMessage({
          type: "error",
          text: `Error: ${result.message}`
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: `Failed to submit form: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-purple-700">CertiUpload</div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#home" className="hover:text-purple-700 transition">Home</a>
            <a href="#about" className="hover:text-purple-700 transition">About</a>
            <a href="#upload" className="hover:text-purple-700 transition">Upload</a>
            <a href="#contact" className="hover:text-purple-700 transition">Contact</a>
          </nav>
          <button className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition text-sm font-medium">
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                Welcome to the Student Certificate Upload Portal
              </h1>
              <p className="text-lg text-gray-600">
                A simple and secure platform designed to help students upload, organize, and manage their academic and extracurricular certificates in one place.
              </p>
              <p className="text-lg font-semibold text-purple-700">
                Keep your achievements organized. Upload with confidence.
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => document.getElementById('upload-form').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-semibold flex items-center gap-2"
                >
                  <Upload size={20} />
                  Upload Certificates
                </button>
                <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-purple-700 hover:text-purple-700 transition font-semibold">
                  Select Department →
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="text-6xl">📚</div>
                  <p className="text-gray-600 font-medium">Your Digital Certificate Hub</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Departments</h2>
            <p className="text-gray-600 text-lg">
              Select your department to streamline certificate management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 hover:shadow-lg transition cursor-pointer border border-gray-200 hover:border-purple-300"
              >
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{dept.name}</h3>
                <p className="text-gray-500 font-semibold">{dept.code}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Upload Form */}
      <section id="upload" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div 
            id="upload-form"
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Upload Your Certificates</h2>

            {/* Messages */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg flex gap-3 ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                ) : (
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                )}
                <p className={`${message.type === 'success' ? 'text-green-700' : 'text-red-700'} font-medium`}>
                  {message.text}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name & Roll Number */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="As per records"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Roll Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    placeholder="e.g., 2024CS001"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.rollNumber ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.rollNumber && <p className="text-red-600 text-sm mt-1">{errors.rollNumber}</p>}
                </div>
              </div>

              {/* Row 2: DOB & Certificate Type */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.dateOfBirth ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Certificate Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="certificateType"
                    value={formData.certificateType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.certificateType ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <option value="">Select Type...</option>
                    {CERTIFICATE_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.certificateType && <p className="text-red-600 text-sm mt-1">{errors.certificateType}</p>}
                </div>
              </div>

              {/* Row 3: Email & Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91-XXXXXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.department ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select Department...</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept.id} value={dept.code}>{dept.name}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-600 text-sm mt-1">{errors.department}</p>}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Upload Certificates <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
                  errors.uploadedFiles 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-purple-300 hover:border-purple-500 bg-purple-50 hover:bg-purple-100'
                }`}>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-input"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <div className="flex justify-center mb-3">
                      <Upload className="text-purple-600" size={44} />
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Drag & drop your certificates here
                    </p>
                    <p className="text-gray-600 text-sm">
                      or click to browse (PDF, DOC, JPG, PNG)
                    </p>
                  </label>
                </div>
                {errors.uploadedFiles && <p className="text-red-600 text-sm mt-2">{errors.uploadedFiles}</p>}

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-2xl">📄</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Submit Certificates
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">CertiUpload</h3>
              <p className="text-gray-400">
                Simplifying the way institutions collect and verify student achievements.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Admin</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Admin Login</a></li>
                <li><a href="#" className="hover:text-white transition">Support Center</a></li>
                <li><a href="#" className="hover:text-white transition">Office Hours</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 CertiUpload University Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
