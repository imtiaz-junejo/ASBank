import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateAccountHeader from '../components/createAccount/CreateAccountHeader';
import BasicDetailsStep from '../components/createAccount/BasicDetailsStep';
import PersonalDetailsStep from '../components/createAccount/PersonalDetailsStep';
import ProfessionalDetailsStep from '../components/createAccount/ProfessionalDetailsStep';
import AccountSecurityStep from '../components/createAccount/AccountSecurityStep';
import ReviewDetailsStep from '../components/createAccount/ReviewDetailsStep';
import CongratulationsStep from '../components/createAccount/CongratulationsStep';

export default function CreateAccountPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleBack = () => {
    if (step === 1) {
      navigate('/login');
      return;
    }
    setStep((s) => s - 1);
  };

  const goToStep = (s) => setStep(s);

  return (
    <div className="min-h-screen bg-[#f5f3f0]">
      <CreateAccountHeader
        currentStep={step}
        onBack={handleBack}
        showProgress={step <= 5}
      />

      <main className="pb-12">
        {step === 1 && (
          <BasicDetailsStep
            data={formData}
            onChange={setFormData}
            onBack={handleBack}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <PersonalDetailsStep
            data={formData}
            onChange={setFormData}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <ProfessionalDetailsStep
            data={formData}
            onChange={setFormData}
            onBack={() => setStep(2)}
            onSubmit={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <AccountSecurityStep
            data={formData}
            onChange={setFormData}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
          />
        )}
        {step === 5 && (
          <ReviewDetailsStep
            data={formData}
            onEditSection={goToStep}
            onSubmit={() => setStep(6)}
          />
        )}
        {step === 6 && (
          <CongratulationsStep
            data={formData}
            onFinish={() => navigate('/login')}
          />
        )}
      </main>

      <div className="fixed bottom-4 left-4 text-xs text-gray-500 z-30">
        <a href="#privacy" className="hover:underline">Privacy</a>
        <span className="mx-1">-</span>
        <a href="#terms" className="hover:underline">Terms</a>
      </div>
    </div>
  );
}


