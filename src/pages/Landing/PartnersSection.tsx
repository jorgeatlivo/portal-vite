import HermannasLogo from '@/assets/logo-hermanas-hospitalarias-bg.svg';
import HlaLogo from '@/assets/logo-hla-bg.svg';
import MutuaTerrassaLogo from '@/assets/logo-mutua-bg.svg';
import PuigvertLogo from '@/assets/logo-puigvert-bg.svg';
import QuironSaludLogo from '@/assets/logo-quiron-bg.svg';
import RiberaLogo from '@/assets/logo-ribera-bg.svg';
import SagradaFamiliaLogo from '@/assets/logo-sagradafamilia-bg.svg';
import SantPauLogo from '@/assets/logo-santpau-bg.svg';
import SciasLogo from '@/assets/logo-scias-bg.svg';
import styles from './PartnersSection.module.scss';

const partners = [
  { name: 'Hermanas Hospitalarias', src: HermannasLogo },
  { name: 'HLA Grupo Hospitalario', src: HlaLogo },
  { name: 'Mútua Terrassa', src: MutuaTerrassaLogo },
  { name: 'Fundació Puigvert', src: PuigvertLogo },
  { name: 'Quirón Salud', src: QuironSaludLogo },
  { name: 'Ribera', src: RiberaLogo },
  { name: 'Clínica Sagrada Família', src: SagradaFamiliaLogo },
  { name: 'Hospital de la Santa Creu i Sant Pau', src: SantPauLogo },
  { name: 'SCIAS Hospital', src: SciasLogo },
];

const PartnersSection = () => {
  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className={styles.partnersContainer}>
        {[0, 1].map((i) => (
          <div
            key={i}
            className={`${styles.partnersMarquee} flex xxs:gap-4 md:gap-16`}
          >
            {partners.map((partner, index) => (
              <img
                key={`partner-${partner.name}-${index}-${i}`}
                src={partner.src}
                alt={partner.name}
                className="h-12 min-w-[120px] max-w-[200px] shrink-0 object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 md:h-16"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersSection;
