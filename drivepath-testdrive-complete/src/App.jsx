import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Checkbox } from './components/ui/checkbox';
import { Label } from './components/ui/label';
import './App.css'; // For global styling

export default function DrivePathWalkthrough() {
  const [step, setStep] = useState(1);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [selfie, setSelfie] = useState(null);
  const [idPhoto, setIdPhoto] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const next = () => setStep(step + 1);

  const triggerAlert = () => {
    setAlertTriggered(true);
    alert("🚨 Miles here! Customer is ready for bank submission.");
  };

  const requestAssistant = () => {
    alert("🔔 Miles is requesting a guest assistant to this station.");
  };

  const StepWrapper = ({ children }) => (
    <Card>
      <CardContent className="space-y-4">
        {children}
        <div className="pt-4 border-t mt-6">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600" onClick={requestAssistant}>
            🛎️ Request Guest Assistant
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleSelfieClick = () => document.getElementById("selfieUpload").click();
  const handleIdClick = () => document.getElementById("idUpload").click();

  useEffect(() => {
    if (verifying) {
      const timer = setTimeout(() => {
        setVerifying(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [verifying]);

  return (
    <div className="drivepath-container">
      {step === 1 && (
        <StepWrapper>
          <h1 className="text-2xl font-bold text-center">Welcome to DrivePath</h1>
          <p className="text-center">
            You’re in control. Miles will guide you through this process step-by-step, and a guest assistant will only join in if you choose to request help below.
          </p>
          <Button className="w-full" onClick={next}>Get Started</Button>
        </StepWrapper>
      )}

      {step === 2 && (
        <StepWrapper>
          <h2 className="text-xl font-semibold">What brings you in today?</h2>
          {['BUY A VEHICLE', 'LEASE A VEHICLE', 'SELL VEHICLE', 'TEST DRIVE ONLY', 'LEASE TURN IN', 'LEASE BUYOUT'].map(option => (
            <Button key={option} className="w-full" onClick={next}>{option}</Button>
          ))}
        </StepWrapper>
      )}

      {step === 3 && (
        <StepWrapper>
          <h2 className="text-xl font-semibold">Do you have a valid Driver’s License or State I.D.?</h2>
          <Button className="w-full" onClick={next}>Yes</Button>
          <Button className="w-full" onClick={next}>No</Button>
        </StepWrapper>
      )}

      {step === 4 && (
        <StepWrapper>
          <h2 className="text-xl font-semibold">How would you like to provide your ID?</h2>
          <Button className="w-full" onClick={next}>📸 Open Camera to Take Selfie and Picture of ID</Button>
          <div className="text-center font-semibold">or</div>
          <Button className="w-full" onClick={next}>👋 Prefer guest assistant to physically collect copy of ID</Button>
        </StepWrapper>
      )}

      {step === 5 && (
        <StepWrapper>
          <h2 className="text-xl font-semibold">Verify Identity</h2>
          <div className="space-y-2">
            <Button className="w-full" onClick={handleSelfieClick}>Take a Selfie</Button>
            <input
              id="selfieUpload"
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => setSelfie(URL.createObjectURL(e.target.files[0]))}
              style={{ display: 'none' }}
            />
            {selfie && <img src={selfie} alt="Selfie Preview" className="w-full rounded" />}
          </div>
          <div className="space-y-2">
            <Button className="w-full" onClick={handleIdClick}>Take a Picture of Your ID</Button>
            <input
              id="idUpload"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setIdPhoto(URL.createObjectURL(e.target.files[0]))}
              style={{ display: 'none' }}
            />
            {idPhoto && <img src={idPhoto} alt="ID Preview" className="w-full rounded" />}
          </div>
          <Button className="w-full" onClick={() => {
            setVerifying(true);
            setStep(6);
          }}>Send for Verification</Button>
        </StepWrapper>
      )}

      {step === 6 && (
        <StepWrapper>
          {verifying ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
              <h2 className="text-xl font-semibold text-center">🔄 Verifying your identity...</h2>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">How would you like to provide your Insurance Info?</h2>
              <Button className="w-full" onClick={next}>📸 Take a picture of Insurance Card</Button>
              <Button className="w-full" onClick={next}>✍️ Enter manually</Button>
            </>
          )}
        </StepWrapper>
      )}

      {step === 7 && (
        <StepWrapper>
          <h2 className="text-xl font-semibold">Your Information</h2>
          <Input placeholder="FIRST NAME" className="uppercase w-full" />
          <Input placeholder="MIDDLE NAME" className="uppercase w-full" />
          <Input placeholder="LAST NAME" className="uppercase w-full" />
          <Input placeholder="SUFFIX (IF ANY)" className="uppercase w-full" />
          <Input placeholder="DATE OF BIRTH (MM-DD-YYYY)" className="w-full" />
          <Input placeholder="LICENSE EXPIRATION DATE" className="w-full" />
          <Input placeholder="STREET ADDRESS" className="uppercase w-full" />
          <Input placeholder="CITY" className="uppercase w-full" />
          <Input placeholder="STATE" className="uppercase w-full" />
          <Input placeholder="ZIP CODE" className="w-full" />
          <Input placeholder="COUNTY" className="uppercase w-full" />
          <Input placeholder="CELL PHONE" className="w-full" />
          <Input placeholder="EMAIL ADDRESS" className="w-full" />
          <Button className="w-full" onClick={next}>Continue</Button>
        </StepWrapper>
      )}

      {step === 8 && (
        <StepWrapper>
          <h2 className="text-xl font-semibold">Ready to Submit?</h2>
          <p>You've completed all required steps. Tap below and Miles will notify our team to assist with final approval.</p>
          <Button className="w-full bg-red-600 hover:bg-red-700" onClick={triggerAlert}>Submit to Bank</Button>
        </StepWrapper>
      )}

      {alertTriggered && (
        <Card>
          <CardContent className="space-y-2 text-green-600 font-semibold">
            ✅ Alert sent! Miles has notified the finance desk. Please wait while we finalize everything.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

