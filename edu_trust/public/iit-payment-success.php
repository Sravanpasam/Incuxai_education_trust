<?php
/**
 * iit-payment-success.php
 * Displays confirmation page to candidate upon successful payment.
 */
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => '',
    'secure'   => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/connection.php';

$token = trim($_GET['t'] ?? '');
$candidate = null;
$error = '';

if (empty($token) || strlen($token) !== 64 || !ctype_xdigit($token)) {
    $error = 'Missing or invalid confirmation token.';
} else {
    try {
        // Query candidate
        $stmt = $conn->prepare(
            "SELECT registration_code, full_name, email, phone, college,
                    payment_status, token_used, token_expires_at, amount_paid,
                    razorpay_order_id, razorpay_payment_id
             FROM iit_visit_registrations
             WHERE success_token = ?
             LIMIT 1"
        );
        $stmt->bind_param('s', $token);
        $stmt->execute();
        $candidate = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$candidate) {
            $error = 'The payment confirmation token is unrecognized.';
        } elseif ((int)$candidate['token_used'] === 1) {
            // Token already consumed — show success on refresh/back-button if payment completed
            if ($candidate['payment_status'] === 'completed' || $candidate['payment_status'] === 'not_required') {
                // fall through to success
            } else {
                $error = 'This payment link has already been used.';
            }
        } elseif (strtotime($candidate['token_expires_at']) < time()) {
            $error = 'Verification token has expired. Please contact support.';
        } elseif ($candidate['payment_status'] !== 'completed' && $candidate['payment_status'] !== 'not_required') {
            $error = 'Payment status is still processing. Please refresh in a moment.';
        } else {
            // Consume token
            $upd = $conn->prepare(
                "UPDATE iit_visit_registrations
                 SET token_used = 1
                 WHERE success_token = ? AND token_used = 0"
            );
            $upd->bind_param('s', $token);
            $upd->execute();
            $rowsAffected = $upd->affected_rows;
            $upd->close();
            
            // Send confirmation email exactly once when the token is successfully consumed
            if ($rowsAffected > 0) {
                require_once __DIR__ . '/../app/mail/IitPaymentMail.php';
                sendIitPaymentConfirmationEmail($candidate);
            }
        }
    } catch (Exception $e) {
        $error = 'Database error: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed — Free IIT Program · IncuXai</title>
    <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
    <link href="assets/libs/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --page-bg: #070b14;
            --card-bg: rgba(15, 22, 41, 0.85);
            --card-border: rgba(124, 124, 255, 0.15);
            
            --neon-primary: #00f5ff;
            --neon-success: #00ffa3;
            --neon-danger: #ff4d6d;
            
            --text-primary: #e2e8f0;
            --text-secondary: #94a3b8;
            --font: 'Inter', system-ui, sans-serif;
        }

        body {
            font-family: var(--font);
            background: var(--page-bg);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: radial-gradient(rgba(0, 255, 163, 0.05) 1px, transparent 1px);
            background-size: 32px 32px;
            pointer-events: none;
            z-index: 0;
        }

        .success-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            width: 100%;
            max-width: 500px;
            padding: 3rem 2rem;
            text-align: center;
            backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            position: relative;
            z-index: 1;
        }

        .success-icon {
            font-size: 4rem;
            color: var(--neon-success);
            margin-bottom: 1.5rem;
            display: inline-block;
            animation: scaleUp 0.4s ease-out;
        }

        @keyframes scaleUp {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }

        h1 {
            font-size: 1.8rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            color: var(--text-secondary);
            font-size: 0.95rem;
            margin-bottom: 2rem;
        }

        .receipt-box {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 1.25rem;
            margin-bottom: 2rem;
            text-align: left;
        }

        .receipt-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            font-size: 0.88rem;
            gap: 12px;
        }

        .receipt-row:last-child {
            margin-bottom: 0;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 0.75rem;
            margin-top: 0.75rem;
            font-weight: 700;
        }

        .receipt-label {
            color: var(--text-secondary);
            white-space: nowrap;
        }

        .receipt-val {
            color: var(--text-primary);
            text-align: right;
            word-break: break-all;
        }

        .btn-home {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-weight: 700;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }

        .btn-home:hover {
            background: var(--neon-primary);
            color: #070b14;
            box-shadow: 0 0 15px rgba(0, 245, 255, 0.25);
            border-color: var(--neon-primary);
        }

        .alert-error {
            background: rgba(255, 77, 109, 0.08);
            border: 1px solid rgba(255, 77, 109, 0.25);
            color: var(--neon-danger);
            padding: 1.25rem;
            border-radius: 8px;
            font-size: 0.9rem;
            margin-bottom: 2rem;
            line-height: 1.5;
        }

        .whatsapp-box {
            background: rgba(37, 211, 102, 0.08);
            border: 1px solid rgba(37, 211, 102, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: center;
        }

        .btn-whatsapp {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #25d366;
            color: #ffffff;
            border: 1px solid #25d366;
            font-weight: 700;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            text-decoration: none;
            font-size: 0.95rem;
            transition: all 0.2s ease;
            width: 100%;
            margin-top: 1rem;
        }

        .btn-whatsapp:hover {
            background: #128c7e;
            border-color: #128c7e;
            box-shadow: 0 0 15px rgba(37, 211, 102, 0.4);
        }
    </style>
</head>
<body>

    <div class="success-card">
        <?php if ($error): ?>
            <div class="success-icon" style="color: var(--neon-danger);">
                <i class="bi bi-x-circle-fill"></i>
            </div>
            <h1>Verification Failed</h1>
            <div class="subtitle">There was an issue loading your payment details.</div>
            <div class="alert-error">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php else: ?>
            <div class="success-icon">
                <i class="bi bi-patch-check-fill"></i>
            </div>
            <?php if ($candidate['payment_status'] === 'not_required'): ?>
                <h1>Registration Confirmed</h1>
                <div class="subtitle">Your preference has been successfully recorded!</div>
            <?php else: ?>
                <h1>Payment Confirmed</h1>
                <div class="subtitle">Your seat for the IIT visit has been successfully secured!</div>
            <?php endif; ?>

            <div class="receipt-box">
                <div class="receipt-row">
                    <span class="receipt-label">Student Name</span>
                    <span class="receipt-val"><?php echo htmlspecialchars($candidate['full_name']); ?></span>
                </div>
                <div class="receipt-row">
                    <span class="receipt-label">Email</span>
                    <span class="receipt-val"><?php echo htmlspecialchars($candidate['email']); ?></span>
                </div>
                <div class="receipt-row">
                    <span class="receipt-label">College</span>
                    <span class="receipt-val"><?php echo htmlspecialchars($candidate['college']); ?></span>
                </div>
                <div class="receipt-row">
                    <span class="receipt-label">Booking Reference</span>
                    <span class="receipt-val" style="font-family: monospace; font-weight: 700; color: var(--neon-primary);"><?php echo htmlspecialchars($candidate['registration_code']); ?></span>
                </div>

                <div class="receipt-row">
                    <span class="receipt-label">Accommodation & Food</span>
                    <span class="receipt-val" style="font-weight: 700; color: <?php echo $candidate['payment_status'] === 'not_required' ? 'var(--neon-danger)' : 'var(--neon-success)'; ?>;">
                        <?php echo $candidate['payment_status'] === 'not_required' ? 'Not Required' : 'Required'; ?>
                    </span>
                </div>
                <div class="receipt-row">
                    <span class="receipt-label">Amount Paid</span>
                    <span class="receipt-val" style="color: var(--neon-success);">
                        <?php 
                        if ($candidate['payment_status'] === 'not_required') {
                            echo "₹0.00";
                        } else {
                            echo "₹" . number_format($candidate['amount_paid'] / 100, 2);
                        }
                        ?>
                    </span>
                </div>
            </div>

            <div class="whatsapp-box">
                <p style="margin-bottom: 0.5rem; font-weight: 700; color: #25d366; font-size: 1.05rem;">📱 Join the Official WhatsApp Group</p>
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                    Please join the official group to receive important updates, event schedules, and instructions regarding the IIT Hyderabad Visit.
                </p>
                <a href="https://chat.whatsapp.com/B6DweDCBMXPIg9nQh1bofy" target="_blank" class="btn-whatsapp">
                    Join WhatsApp Group <i class="bi bi-whatsapp"></i>
                </a>
            </div>
        <?php endif; ?>

        <a href="/" class="btn-home">
            Return to Homepage <i class="bi bi-house-door-fill"></i>
        </a>
    </div>

</body>
</html>
