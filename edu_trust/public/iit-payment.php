<?php
/**
 * iit-payment.php
 * Verification and payment initialization page for the IIT Program.
 * Pricing: Selected (Accepted) ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹1800 + 2% | Others ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹4000 + 2%
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

// Generate CSRF token
$csrf = $_SESSION['csrf_token'] ?? '';
if (empty($csrf)) {
    $csrf = bin2hex(random_bytes(32));
    $_SESSION['csrf_token'] = $csrf;
}

$search    = trim($_GET['search'] ?? '');
$candidate = null;
$error     = '';
$baseFee   = 0;
$platformFee = 0;
$fee       = 0;

// Handle errors from the process handler redirect
$errorCode = $_GET['error'] ?? '';
if ($errorCode) {
    $error = match ($errorCode) {
        'invalid'      => 'Session expired. Please search again and retry.',
        'rate_limit'   => 'Too many attempts. Please try again in 10 minutes.',
        'not_selected' => 'Only selected candidates can proceed with payment.',
        'slots_full'   => 'Sorry slots are not available.',
        'slots_full_selected' => '',
        'server_error' => 'A server error occurred while processing your payment. Please try again.',
        'email_exists' => 'This registration has already been paid. Your seat is already confirmed.',
        default        => ''
    };
}

if (!empty($search)) {
    try {
        $stmt = $conn->prepare("SELECT id, full_name, email, phone, college, status, payment_status FROM iit_visit_registrations WHERE email = ? OR phone = ? LIMIT 1");
        $stmt->bind_param("ss", $search, $search);
        $stmt->execute();
        $res = $stmt->get_result();
        if ($res && $res->num_rows > 0) {
            $candidate = $res->fetch_assoc();

            // Pricing ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â only selected (Accepted) candidates can pay
            if ($candidate['status'] === 'Accepted') {
                $baseFee = 5500;
            } else {
                $baseFee = 5500;
            }
            $platformFee = round($baseFee * 0.02, 2);
            $fee         = $baseFee + $platformFee;
        } else {
            $error = 'No registration found for the provided email or phone number. Please check and try again.';
        }
        $stmt->close();
    } catch (Exception $e) {
        $error = 'System error occurred: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Program Payment - IIT Hyderabad AI Innovation Program | IncuXai</title>
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
            --neon-secondary: #7c7cff;
            --neon-success: #00ffa3;
            --neon-danger: #ff4d6d;
            --neon-warning: #ffd166;
            --text-primary: #e2e8f0;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --hover-bg: rgba(124, 124, 255, 0.08);
            --font: 'Inter', system-ui, sans-serif;
        }

        html, body {
            min-height: 100%;
            margin: 0;
            font-family: var(--font);
            background: var(--page-bg);
            color: var(--text-primary);
            -webkit-font-smoothing: antialiased;
        }

        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: radial-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px);
            background-size: 32px 32px;
            pointer-events: none;
            z-index: 0;
        }

        .main-container {
            position: relative;
            z-index: 1;
            min-height: 100vh;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 2rem 1rem 4rem;
        }

        .payment-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            width: 100%;
            max-width: 600px;
            padding: 2.5rem;
            backdrop-filter: blur(12px);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .brand-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 2rem;
            text-decoration: none;
            color: var(--text-primary);
            font-weight: 900;
            font-size: 1.5rem;
            letter-spacing: -0.04em;
        }

        .brand-logo span { color: var(--neon-primary); }

        .header-title {
            text-align: center;
            margin-bottom: 2rem;
        }

        .header-title h1 {
            font-size: 1.8rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            margin-bottom: 0.5rem;
        }

        .header-title p {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
            position: relative;
        }

        .form-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }

        .input-wrap {
            position: relative;
            display: flex;
            align-items: center;
        }

        .input-wrap i {
            position: absolute;
            left: 14px;
            color: var(--text-secondary);
            font-size: 1.1rem;
        }

        .form-control {
            width: 100%;
            background: rgba(10, 25, 47, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: var(--text-primary);
            border-radius: 8px;
            padding: 12px 16px 12px 42px;
            font-size: 0.95rem;
            font-family: var(--font);
            transition: all 0.2s ease;
        }

        .form-control:focus {
            outline: none;
            background: rgba(10, 25, 47, 0.9);
            border-color: var(--neon-primary);
            box-shadow: 0 0 12px rgba(0, 245, 255, 0.25);
        }

        .btn-submit {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            background: var(--neon-primary);
            color: #070b14;
            border: none;
            font-weight: 800;
            padding: 14px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.2s ease;
            box-shadow: 0 0 15px rgba(0, 245, 255, 0.2);
        }

        .btn-submit:hover:not(:disabled) {
            box-shadow: 0 0 25px rgba(0, 245, 255, 0.4);
            transform: translateY(-1px);
        }

        .btn-submit:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none;
        }

        .info-box {
            background: rgba(124, 124, 255, 0.08);
            border: 1px solid rgba(124, 124, 255, 0.25);
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }

        .info-box h3 {
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: var(--neon-secondary);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            padding-bottom: 0.5rem;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
        }

        .info-row:last-child { margin-bottom: 0; }

        .info-label { color: var(--text-secondary); }

        .info-val {
            font-weight: 600;
            color: var(--text-primary);
        }

        .price-box {
            border-top: 1px dashed rgba(255, 255, 255, 0.15);
            margin-top: 1rem;
            padding-top: 1rem;
        }

        .alert-error {
            background: rgba(255, 77, 109, 0.08);
            border: 1px solid rgba(255, 77, 109, 0.25);
            color: var(--neon-danger);
            padding: 1rem;
            border-radius: 8px;
            font-size: 0.88rem;
            margin-bottom: 1.5rem;
            line-height: 1.5;
        }

        .badge-status {
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
        }
        .badge-status.Accepted  { background: rgba(0, 255, 163, 0.15); color: var(--neon-success); }
        .badge-status.Rejected  { background: rgba(255, 77, 109, 0.15); color: var(--neon-danger); }
        .badge-status.Applied,
        .badge-status.Under_Review { background: rgba(255, 209, 102, 0.15); color: var(--neon-warning); }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.85rem;
            margin-top: 1.5rem;
            transition: color 0.2s;
        }

        .back-link:hover { color: var(--text-primary); }

        /* ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Terms & Conditions ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ */
        .tnc-section { margin-bottom: 1.5rem; }

        .tnc-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 1rem 1.25rem;
            background: linear-gradient(135deg, rgba(0,245,255,0.06), rgba(124,124,255,0.08));
            border: 1px solid rgba(0,245,255,0.2);
            border-bottom: none;
            border-radius: 10px 10px 0 0;
        }

        .tnc-header i {
            font-size: 1.2rem;
            color: var(--neon-primary);
        }

        .tnc-header-text { flex: 1; }

        .tnc-header-text h3 {
            font-size: 0.95rem;
            font-weight: 800;
            color: var(--text-primary);
            letter-spacing: 0.02em;
            margin-bottom: 2px;
        }

        .tnc-header-text p {
            font-size: 0.72rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        .tnc-body {
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 0 0 10px 10px;
            overflow: hidden;
        }

        .tnc-clause {
            display: flex;
            gap: 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .tnc-clause:last-child { border-bottom: none; }

        .tnc-clause-num {
            flex-shrink: 0;
            width: 44px;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 1.1rem 0 1.1rem;
            font-size: 0.72rem;
            font-weight: 800;
            color: var(--neon-secondary);
            background: rgba(124,124,255,0.05);
            border-right: 1px solid rgba(255,255,255,0.05);
            letter-spacing: 0.03em;
        }

        .tnc-clause-content {
            flex: 1;
            padding: 1rem 1.25rem;
            background: rgba(7,11,20,0.5);
        }

        .tnc-clause-content h4 {
            font-size: 0.82rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.45rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }

        .tnc-clause-content p {
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.65;
            margin-bottom: 0.4rem;
        }

        .tnc-clause-content p:last-child { margin-bottom: 0; }

        .tnc-clause-content ul {
            margin: 0.3rem 0 0.4rem 0;
            padding-left: 1.1rem;
            font-size: 0.8rem;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        .tnc-clause-content ul li { margin-bottom: 0.15rem; }

        .tnc-clause-content .highlight {
            color: var(--neon-warning);
            font-weight: 600;
        }

        .tnc-agree-bar {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-top: 1.2rem;
            padding: 1rem 1.25rem;
            background: rgba(0,245,255,0.04);
            border: 1px solid rgba(0,245,255,0.15);
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s, border-color 0.2s;
        }

        .tnc-agree-bar:hover {
            background: rgba(0,245,255,0.07);
            border-color: rgba(0,245,255,0.3);
        }

        .tnc-agree-bar input[type="checkbox"] {
            accent-color: var(--neon-primary);
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            cursor: pointer;
        }

        .tnc-agree-bar-text { flex: 1; }

        .tnc-agree-bar-text strong {
            display: block;
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 2px;
        }

        .tnc-agree-bar-text span {
            font-size: 0.75rem;
            color: var(--text-muted);
        }
    </style>
</head>
<body>

    <div class="main-container">
        <div class="payment-card">
            <a href="/" class="brand-logo">
                Incu<span>X</span>ai
            </a>

            <div class="header-title">
                <h1>IIT Program Payment</h1>
                <p>IIT Hyderabad AI Innovation &amp; Career Experience Program</p>
            </div>

            <?php if ($error): ?>
                <div class="alert-error">
                    <i class="bi bi-exclamation-triangle-fill"></i> <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

                        <?php if (!$candidate): ?>
                <div class="search-section" style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 12px; margin-top: 20px;">
                    <p style="color: var(--text-secondary); text-align: center; margin-bottom: 20px; font-size: 0.95rem;">
                        Enter your registered email or phone number to verify your selection status and proceed to payment.
                    </p>
                    <form method="GET" action="iit-payment.php" class="search-form">
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label for="search" class="form-label" style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Email or Phone Number</label>
                            <input type="text" id="search" name="search" class="form-input" 
                                   placeholder="e.g. name@example.com or 9876543210" 
                                   value="<?php echo htmlspecialchars($search); ?>" required
                                   style="width: 100%; padding: 12px 15px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(0, 0, 0, 0.3); color: #fff; font-family: inherit;">
                        </div>
                        <button type="submit" class="btn-submit" style="width: 100%; padding: 14px; background: var(--neon-primary); color: #0a0a0a; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            Search & Verify Status <i class="bi bi-search"></i>
                        </button>
                    </form>
                </div>
            <?php else: ?>
                <!-- Details & Payment -->
                <div class="info-box">
                    <h3>Candidate Details</h3>
                    <div class="info-row">
                        <span class="info-label">Name</span>
                        <span class="info-val"><?php echo htmlspecialchars($candidate['full_name']); ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">College</span>
                        <span class="info-val"><?php echo htmlspecialchars($candidate['college']); ?></span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Selection Status</span>
                        <span class="info-val">
                            <span class="badge-status <?php echo str_replace(' ', '_', $candidate['status']); ?>">
                                <?php echo htmlspecialchars($candidate['status']); ?>
                            </span>
                        </span>
                    </div>

                    <!-- Pricing -->
                    <div class="price-box">
                        <div class="info-row">
                            <span class="info-label">
                                <?php if ($candidate['status'] === 'Accepted'): ?>
                                    Program Fee (Selected Candidate)
                                <?php else: ?>
                                    Program Fee
                                <?php endif; ?>
                            </span>
                            <span class="info-val">INR <?php echo number_format($baseFee, 2); ?></span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Platform Fee (2%)</span>
                            <span class="info-val">INR <?php echo number_format($platformFee, 2); ?></span>
                        </div>
                        <div class="info-row" style="font-size: 1.1rem; font-weight: 800; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 0.5rem; padding-top: 0.5rem;">
                            <span class="info-label" style="color: var(--neon-primary);">Total Payable Amount</span>
                            <span class="info-val" style="color: var(--neon-primary);">INR <?php echo number_format($fee, 2); ?></span>
                        </div>
                    </div>
                </div>

                <?php if ($candidate['payment_status'] === 'completed'): ?>
                    <div style="border: 1px solid var(--neon-success); padding: 15px; border-radius: 8px; background: rgba(0, 255, 163, 0.05); color: var(--neon-success); text-align: center;">
                        <i class="bi bi-check-circle-fill"></i> You have already paid and confirmed your seat!
                    </div>
                    <a href="iit-payment.php" class="back-link"><i class="bi bi-arrow-left"></i> Check another registration</a>

                <?php elseif ($candidate['payment_status'] === 'not_required'): ?>
                    <div style="border: 1px solid var(--neon-warning); padding: 15px; border-radius: 8px; background: rgba(255, 209, 102, 0.05); color: var(--neon-warning); text-align: center;">
                        <i class="bi bi-info-circle-fill"></i> Your registration does not require payment.
                    </div>
                    <a href="iit-payment.php" class="back-link"><i class="bi bi-arrow-left"></i> Check another registration</a>

                                <?php else: ?>
                    <form method="POST" action="handlers/process-iit-payment.php" id="payment-form">
                        <input type="hidden" name="csrf_token" value="<?php echo $csrf; ?>">
                        <input type="hidden" name="registration_id" value="<?php echo $candidate['id']; ?>">
                        <input type="hidden" name="coupon" id="applied_coupon" value="">
                        
                        <div style="margin-bottom: 20px;">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 0.9rem;">Have a discount coupon?</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="text" id="coupon_input" placeholder="Enter coupon code" style="flex: 1; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; text-transform: uppercase;">
                                <button type="button" id="apply_coupon_btn" style="padding: 0 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; cursor: pointer; transition: all 0.2s;">Apply</button>
                            </div>
                            <div id="coupon_msg" style="margin-top: 8px; font-size: 0.85rem; height: 16px;"></div>
                        </div>

                        <button type="submit" class="btn-submit" id="submit-button" style="width: 100%; padding: 16px; background: var(--neon-primary); color: #0a0a0a; border: none; border-radius: 12px; font-weight: 700; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s ease;">
                            Proceed to Secure Payment <i class="bi bi-shield-lock-fill"></i>
                        </button>
                    </form>
                    <a href="iit-payment.php" class="back-link" style="display: block; text-align: center; margin-top: 20px; color: var(--text-secondary); text-decoration: none;"><i class="bi bi-arrow-left"></i> Verify a different email/phone</a>
                <?php endif; // end payment_status check ?>
            <?php endif; // end candidate check ?>

        </div>
    </div>

    <script>
        const validCoupons = ["YASH500", "RAVI500", "SRI500", "SIRI500", "VAMSI500", "PREET500", "INCUX500", "BINDHU500", "HARINI500", "DEVA500", "SAI500", "CHANDU500"];
        const btn = document.getElementById("apply_coupon_btn");
        if(btn) {
            btn.addEventListener("click", () => {
                const input = document.getElementById("coupon_input").value.trim().toUpperCase();
                const msg = document.getElementById("coupon_msg");
                const totalDisplay = document.getElementById("total-fee-display");
                const baseDisplay = document.getElementById("base-fee-display");
                const platformDisplay = document.getElementById("platform-fee-display");
                const hiddenInput = document.getElementById("applied_coupon");
                
                if (!input) return;
                
                if (validCoupons.includes(input)) {
                    msg.innerHTML = "Coupon applied! INR 500 discount.";
                    msg.style.color = "var(--neon-success)";
                    if(totalDisplay) totalDisplay.innerHTML = "<del style='color: var(--text-secondary); font-size: 0.9em; margin-right: 8px;'>INR 5,610.00</del> INR 5,100.00";
                    if(baseDisplay) baseDisplay.innerHTML = "<del style='color: var(--text-secondary); font-size: 0.9em; margin-right: 8px;'>INR 5,500.00</del> INR 5,000.00";
                    if(platformDisplay) platformDisplay.innerHTML = "<del style='color: var(--text-secondary); font-size: 0.9em; margin-right: 8px;'>INR 110.00</del> INR 100.00";
                    hiddenInput.value = input;
                    btn.textContent = "Applied";
                    btn.style.background = "rgba(0, 255, 163, 0.1)";
                    btn.style.borderColor = "var(--neon-success)";
                    btn.style.color = "var(--neon-success)";
                } else {
                    msg.innerHTML = "Invalid coupon code.";
                    msg.style.color = "var(--neon-warning)";
                    if(totalDisplay) totalDisplay.innerHTML = "INR 5,610.00";
                    if(baseDisplay) baseDisplay.innerHTML = "INR 5,500.00";
                    if(platformDisplay) platformDisplay.innerHTML = "INR 110.00";
                    hiddenInput.value = "";
                    btn.textContent = "Apply";
                    btn.style.background = "rgba(255,255,255,0.1)";
                    btn.style.borderColor = "rgba(255,255,255,0.2)";
                    btn.style.color = "#fff";
                }
            });
        }
    </script>
</body>
</html>
