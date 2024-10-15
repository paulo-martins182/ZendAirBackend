export const TEMPLATE_CONFIRM_MAIL = ({
  destination,
  formattedStartDate,
  formattedEndDate,
  confirmationLink,
}: {
  destination: string;
  formattedStartDate: string;
  formattedEndDate: string;
  confirmationLink: string;
}) => {
  return `
<div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
  <p>Você foi convidado para participar de uma viagem <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
  <p></p>
  <p>Para confirmar sua viagem, clique no link abaixo:</p>
  <p></p>
  <p>
    <a href=${confirmationLink}>Confirmar viagem</a>
  </p>
  <p></p>
  <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
</div>
`.trim();
};
