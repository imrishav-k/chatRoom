class Auth {
  constructor() {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.initEventListeners();
    this.checkAuthentication();
  }

  initEventListeners() {
    // Signup form
    if(document.getElementById('signupForm')) {
      document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.signup();
      });
    }

    // Login form
    if(document.getElementById('loginForm')) {
      document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        this.login();
      });
    }

    // Logout button
    if(document.getElementById('logoutBtn')) {
      document.getElementById('logoutBtn').addEventListener('click', () => {
        this.logout();
      });
    }
  }

  checkAuthentication() {
    if(this.token && window.location.pathname !== '/dashboard.html') {
      window.location.href = '/dashboard.html';
    } else if(!this.token &&
      (window.location.pathname === '/dashboard.html' ||
        window.location.pathname === '/')) {
      window.location.href = '/login.html';
    }

    if(this.user && document.getElementById('userInfo')) {
      document.getElementById('userInfo').innerHTML = `
              <p>Username: ${this.user.username}</p>
              <p>Email: ${this.user.email}</p>
          `;
    }
  }

  async signup() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (data.success) {
        this.showMessage('Signup successful! Please login.', 'success');
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
      } else {
        this.showMessage(data.error, 'error');
      }
    } catch (error) {
      this.showMessage('An error occurred. Please try again.', 'error');
    }
  }

  async login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        this.token = data.data.token;
        this.user = data.data.user;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        this.showMessage('Login successful!', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1000);
      } else {
        this.showMessage(data.error, 'error');
      }
    } catch (error) {
      this.showMessage('An error occurred. Please try again.', 'error');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;
    window.location.href = '/login.html';
  }

  showMessage(message, type) {
    const messageEl = document.getElementById('message');
    if (messageEl) {
      messageEl.textContent = message;
      messageEl.className = `message ${type}`;
      setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
      }, 3000);
    }
  }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Auth();
});