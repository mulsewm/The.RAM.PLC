'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PartnerForm } from './partner-form';

export function PartnershipModal() {
  const [isOpen, setIsOpen] = useState(false);
  const hiddenButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {/* Hidden button that can be triggered programmatically */}
      <button 
        ref={hiddenButtonRef}
        id="partnership-modal"
        onClick={() => setIsOpen(true)}
        className="hidden"
        aria-hidden="true"
      >
        Open Partnership Form
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <PartnerForm open={isOpen} onOpenChange={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
