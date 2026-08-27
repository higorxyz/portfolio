import { useCallback, useState } from 'react';
import { Mail, Globe, Zap, Send } from 'lucide-react';
import { SiGithub, SiLinkedin, SiInstagram } from 'react-icons/si';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../../hooks/useLanguage';
import { sendEmail } from '../../config';

const INITIAL_FORM = { name: '', email: '', message: '' };

export const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formStatus, setFormStatus] = useState('');

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFormSubmit = useCallback(async (event) => {
    event.preventDefault();
    setFormStatus('sending');

    try {
      await sendEmail(emailjs, event.target);
      setFormStatus('success');
      setFormData(INITIAL_FORM);
      setTimeout(() => setFormStatus(''), 3000);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(''), 3000);
    }
  }, []);

  return (
    <section id="contato" className="py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-10">
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2">
            <span className="font-mono text-xs text-accent-signal-text">04 /</span>
            <Mail className="text-accent-trace-text w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary">
              {t('contact.title')}
            </h2>
          </div>
        <p className="text-center sm:text-left text-text-secondary text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl sm:pl-11 leading-relaxed px-4 sm:px-0">
          {t('contact.subtitle')}
        </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-6 sm:mb-10">
          <div className="bg-bg-surface border border-line border-l-2 border-l-accent-signal p-4 sm:p-6 rounded-r-lg">
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className="block text-text-secondary font-semibold text-sm mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder={t('contact.form.name')}
                  required
                  className="card-motion-input w-full bg-bg-primary/50 border border-line text-text-primary px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base focus:outline-none focus:border-accent-trace focus:shadow-lg"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-text-secondary font-semibold text-sm mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder={t('contact.form.email')}
                  required
                  className="card-motion-input w-full bg-bg-primary/50 border border-line text-text-primary px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base focus:outline-none focus:border-accent-trace focus:shadow-lg"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-text-secondary font-semibold text-sm mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder={t('contact.form.message')}
                  rows="5"
                  required
                  className="card-motion-input w-full bg-bg-primary/50 border border-line text-text-primary px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base focus:outline-none focus:border-accent-trace focus:shadow-lg resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-accent-signal text-on-accent rounded-lg font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform shadow-xl disabled:opacity-60"
              >
                {formStatus === 'sending' ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('contact.form.sending')}
                  </>
                ) : formStatus === 'success' ? (
                  <>{t('contact.form.success')}</>
                ) : formStatus === 'error' ? (
                  <>{t('contact.form.errorShort')}</>
                ) : (
                  <>
                    <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
                    {t('contact.form.send')}
                  </>
                )}
              </button>
              {formStatus === 'success' && (
                <p className="text-green-400 text-center font-semibold text-sm">
                  {t('contact.form.success')}
                </p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-400 text-center font-semibold text-sm">
                  {t('contact.form.error')}
                </p>
              )}
            </form>
          </div>

          <div className="border-t border-line">
            <div className="flex items-start gap-4 py-5 border-b border-line">
              <Mail className="text-accent-trace-text w-5 h-5 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-base mb-1">{t('contact.email')}</h3>
                <p className="text-text-secondary text-sm">dev.higorxyz@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-5 border-b border-line">
              <Globe className="text-accent-trace-text w-5 h-5 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-base mb-1">{t('contact.location')}</h3>
                <p className="text-text-secondary text-sm">{t('contact.locationValue')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-5 border-b border-line">
              <Zap className="text-accent-signal-text w-5 h-5 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold text-base mb-1">{t('contact.response')}</h3>
                <p className="text-text-secondary text-sm">{t('contact.responseTime')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto flex items-center gap-5 sm:gap-7 justify-end flex-wrap">
          <span className="font-mono text-xs text-text-secondary">{t('contact.social')}</span>
          <a
            href="https://github.com/higorxyz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="card-motion w-11 h-11 bg-bg-surface border border-line rounded-lg flex items-center justify-center hover:border-accent-signal hover:-translate-y-1"
          >
            <SiGithub size={28} className="sm:w-8 sm:h-8" aria-hidden="true" />
          </a>
          <a
            href="https://www.linkedin.com/in/higorbatista"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="card-motion w-11 h-11 bg-bg-surface border border-line rounded-lg flex items-center justify-center hover:border-accent-signal hover:-translate-y-1"
          >
            <SiLinkedin size={28} className="sm:w-8 sm:h-8" aria-hidden="true" />
          </a>
          <a
            href="https://www.instagram.com/higorxyz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="card-motion w-11 h-11 bg-bg-surface border border-line rounded-lg flex items-center justify-center hover:border-accent-signal hover:-translate-y-1"
          >
            <SiInstagram size={28} className="sm:w-8 sm:h-8" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};
