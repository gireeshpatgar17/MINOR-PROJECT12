// auth.js
// Handles registration, login and OTP verification with smooth toast notifications

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// MetaMask Integration
async function connectMetaMask() {
    const connectBtn = document.getElementById("connectWallet");
    const originalText = connectBtn.textContent;
    
    try {
        // Show loading state
        connectBtn.textContent = "Connecting...";
        connectBtn.disabled = true;
        
        // Use the connectWallet function from metamask.js
        const userAddress = await window.connectWallet();
        
        if (!userAddress) {
            return; // Error already handled by connectWallet
        }
        
        // Show wallet status
        const walletStatus = document.getElementById("walletStatus");
        const walletAddress = document.getElementById("walletAddress");
        if (walletStatus && walletAddress) {
            walletStatus.style.display = "block";
            walletStatus.style.background = "#e6f7ff";
            walletStatus.style.border = "1px solid #91d5ff";
            walletAddress.textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        }

        // Create message to sign
        const messageToSign = `Welcome to the Voting dApp!\n\nPlease sign this message to log in.\n\nNonce: ${new Date().getTime()}`;

        try {
            // Sign the message
            const signature = await window.ethereum.request({
                method: "personal_sign",
                params: [messageToSign, userAddress]
            });

            showToast("Signature verified! Logging in...", "success");
            
            // Here you would typically send to backend for verification
            // For now, we'll simulate a successful login
            
            // Get the user role from session storage
            const userRole = sessionStorage.getItem('userRole') || 'voter';
            
            // Redirect based on role
            setTimeout(() => {
                window.location.href = userRole === 'admin' ? 'admin.html' : 'dashboard.html';
            }, 1500);
            
        } catch (error) {
            console.error('Signature error:', error);
            showToast("Signature failed or rejected", "error");
        }

    } catch (error) {
        console.error('MetaMask connection error:', error);
        showToast("MetaMask connection failed", "error");
    } finally {
        // Reset button state
        if (connectBtn) {
            connectBtn.textContent = originalText;
            connectBtn.disabled = false;
        }
    }
}

// Connect MetaMask button event listener
document.addEventListener('DOMContentLoaded', function() {
    const connectWalletBtn = document.getElementById('connectWallet');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectMetaMask);
    }
});
// Registration form
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(registerForm);
        const fullName = formData.get('fullName');
        const dateOfBirth = formData.get('dateOfBirth');
        const mobileNumber = formData.get('mobileNumber');
        const biometric = formData.get('biometric');
        
        // Basic validation
        if (!fullName || !dateOfBirth || !mobileNumber || !biometric) {
            showToast("Please fill in all fields", "error");
            return;
        }
        
        // Validate mobile number format
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobileNumber)) {
            showToast("Please enter a valid 10-digit mobile number", "error");
            return;
        }
        
        // Validate age (must be 18+)
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (age < 18 || (age === 18 && monthDiff < 0)) {
            showToast("You must be 18 years or older to register", "error");
            return;
        }
        
        showToast("Registered successfully! Redirecting to login...", "success");
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
}

// Real OTP integration via backend (Twilio Verify). Configure OTP_API_BASE in .env or use default.
const OTP_API_BASE = (window.OTP_API_BASE || "http://localhost:4000").replace(/\/$/, "");

async function requestOtp(aadhaarOrMobile) {
    const to = aadhaarOrMobile.startsWith("+") ? aadhaarOrMobile : `+91${aadhaarOrMobile}`;
    const res = await fetch(`${OTP_API_BASE}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Failed to send OTP");
    sessionStorage.setItem("otpVerified", "false");
}

async function verifyOtpRemote(aadhaarOrMobile, inputOtp) {
    const to = aadhaarOrMobile.startsWith("+") ? aadhaarOrMobile : `+91${aadhaarOrMobile}`;
    const res = await fetch(`${OTP_API_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, code: inputOtp })
    });
    const data = await res.json();
    if (!data.ok) return false;
    sessionStorage.setItem("otpVerified", "true");
    return true;
}

// Login with OTP flow
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    const sendBtn = document.getElementById("sendOtpBtn");
    const verifyBtn = document.getElementById("verifyOtpBtn");
    const otpInput = document.getElementById("otpInput");
    const idInput = document.getElementById("aadhaarOrMobile");

    if (sendBtn && idInput) {
        sendBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const idVal = idInput.value.trim();
            if (!idVal) {
                showToast("Enter Aadhaar or Mobile first", "error");
                return;
            }
            try {
                await requestOtp(idVal);
                showToast("OTP sent. Check your registered mobile.", "success");
            } catch (err) {
                showToast("Failed to send OTP", "error");
            }
        });
    }

    if (verifyBtn && otpInput) {
        verifyBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const idVal = idInput.value.trim();
            const ok = await verifyOtpRemote(idVal, otpInput.value.trim());
            if (ok) {
                showToast("OTP verified ✅", "success");
                setTimeout(() => {
                    // Get role from sessionStorage and redirect accordingly
                    const userRole = sessionStorage.getItem('userRole') || 'voter';
                    if (userRole === 'admin') {
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "dashboard.html";
                    }
                }, 800);
            } else {
                showToast("Invalid OTP", "error");
            }
        });
    }
}
