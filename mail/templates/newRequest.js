exports.newRequestEmail = (donorName, HospitalName, bloodGroup) => {
  return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Blood Needed</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
    
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
    
            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }
    
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
    
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
    
            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
    
            .highlight {
                font-weight: bold;
            }
        </style>
    
    </head>
    
    <body>
        <div class="container">
  <div class="message">New Blood Request Added</div>
  <div class="body">
    <p>Dear ${donorName},</p>
    <p>We are reaching out to inform you that your blood group matches the current urgent need for blood <span class="highlight">"${bloodGroup}"</span> at ${HospitalName} Hospital.</p>
    <p>Your willingness to contribute to saving lives is highly appreciated. To get more details about this requirement and make a valuable contribution, please log in to your dashboard.</p>
    <a class="cta" href="#">Go to Dashboard</a>
  </div>
</div>


    </body>
    
    </html>`;
};
