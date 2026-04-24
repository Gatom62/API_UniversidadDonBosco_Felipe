export const HTMLRecoveryEmail = (code) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center;">Recuperación de Contraseña</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">
          Hola, hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código de verificación para continuar con el proceso:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 5px;">
            ${code}
          </span>
        </div>
        <p style="color: #777; font-size: 14px; text-align: center;">
          Este código expirará en 15 minutos. Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} PolloPollon - Todos los derechos reservados.
        </p>
      </div>
    </div>
  `;
};