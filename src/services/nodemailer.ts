import { Transporter, createTestAccount, createTransport, getTestMessageUrl, SentMessageInfo } from 'nodemailer'
import { config } from '../common'
class NodeMailer {
  private transporter: Transporter;
  constructor() {
    if (config.isDev) {
      this.buildAccountDev()
    } else {
      this.buildAccountProd()
    }
  }

  private async buildAccountDev() {
    const testAccount = await createTestAccount();
    this.transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });
  }

  private async buildAccountProd() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPass
      }
    })
  }

  public async sendMail(to: string, subject: string, html: string): Promise<{ info: SentMessageInfo, testUrl: string | null }> {
    const info = await this.transporter.sendMail({

      from: 'Kaylee\'s Candy🦄 <kayleescandy@gmail.com>',
      to: to,
      subject: subject,
      html: html
    });
    const testUrl = getTestMessageUrl(info) || null
    if (testUrl) console.log(testUrl)
    return { info, testUrl }
  }
}

export default new NodeMailer()