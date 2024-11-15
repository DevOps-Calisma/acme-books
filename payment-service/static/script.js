// payment-service/static/script.js
document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const orderId = document.getElementById('orderId').value;
    const amount = document.getElementById('amount').value;

    try {
        const response = await fetch('/payment/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId, amount })
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed');
    }
});
