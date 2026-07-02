const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const injection = 

  // --- INCUXAI IIT VISIT PAYMENT INJECTION ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regCode = params.get('reg_code');
    if (regCode) {
      // Auto trigger IIT payment flow
      fetch('http://localhost:3001/api/get-registration/' + regCode)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            alert(data.error);
            window.location.href = 'http://localhost:8000/payment.php';
            return;
          }
          
          fetch('http://localhost:3001/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: data.amount, currency: 'INR', receipt: 'iit_' + regCode }),
          })
          .then(res => res.json())
          .then(orderData => {
            const options = {
              key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T89U7UEA6mDKNX',
              amount: orderData.amount,
              currency: orderData.currency,
              name: 'Incuxeducation Trust',
              description: 'IIT Visit Program Payment',
              order_id: orderData.order_id,
              handler: function (response) {
                fetch('http://localhost:3001/api/verify-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    reg_code: regCode,
                    amount_paid: orderData.amount
                  }),
                })
                .then(res => res.json())
                .then(verifyData => {
                  if (verifyData.status === 'success') {
                    window.location.href = 'http://localhost:8000/iit-payment-success.php?t=' + verifyData.success_token;
                  } else {
                    alert('Verification failed');
                  }
                });
              },
              theme: { color: '#9B7A3E' }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          });
        })
        .catch(err => {
          console.error(err);
          alert('Failed to initialize payment');
        });
    }
  }, []);
  // --- END INCUXAI IIT VISIT PAYMENT INJECTION ---

;

const newContent = content.replace('export default function App() {', 'export default function App() {' + injection);
fs.writeFileSync('src/App.tsx', newContent);
console.log('App.tsx patched successfully');
