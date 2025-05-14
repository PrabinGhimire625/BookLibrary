using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using MimeKit;
namespace BookLibrary.Services.Email;

public class EmailService
{
    private readonly SmtpSettings _smtpSettings;
    // Constructor that loads SMTP settings from configuration via dependency injection

    public EmailService(IOptions<SmtpSettings> smtpSettings)
    {
        _smtpSettings = smtpSettings.Value;
    }
    // Method to send an HTML email asynchronously
    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_smtpSettings.Email)); //sender email
        email.To.Add(MailboxAddress.Parse(toEmail)); //receiver email
        email.Subject = subject;
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = htmlBody };

        // Send email using SMTP client
        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_smtpSettings.Host, _smtpSettings.Port, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_smtpSettings.Email, _smtpSettings.Password);
        await smtp.SendAsync(email); //send the email
        await smtp.DisconnectAsync(true); //disconnect after sending
    }
}