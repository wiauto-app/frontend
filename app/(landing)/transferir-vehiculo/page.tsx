import { LandingContainer } from '@/components/ui/landingContainer';
import { ChangaCarHero } from './components/ChangaCarHero';
import { PapersCards } from './components/PapersCards';
import { TransferSteps } from './components/TransferSteps';
import { MySellsCard } from './components/MySellsCard';
import { TransferForm } from './components/TransferForm';
import { CheckCarCard } from './components/CheckCarCard';

export const metadata = {
  title: 'Transferir Vehículo | WiAuto',
  description: 'Transferencia de vehículo con WiAuto',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function TransferirVehiculoPage() {
  return (
    <>
      <LandingContainer className='py-6 md:py-10 space-y-2'>
        <ChangaCarHero />
        <PapersCards />
        <TransferSteps />
        <MySellsCard />
        <TransferForm />
        <CheckCarCard />
      </LandingContainer>
    </>
  );
}
