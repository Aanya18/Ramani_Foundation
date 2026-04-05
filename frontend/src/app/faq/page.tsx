export default function FAQ() {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-manrope font-bold text-primary mb-12 text-center">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-manrope font-bold text-primary mb-2">How can I donate?</h3>
          <p className="font-publicSans text-gray-700">You can donate through our website by visiting the Donate page, where you will find our bank details and a QR code. After transferring, please upload the proof of payment.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-manrope font-bold text-primary mb-2">Are my donations tax-deductible?</h3>
          <p className="font-publicSans text-gray-700">Yes, Ramani Foundation is a registered NGO, and all donations are tax-deductible under applicable laws. We will provide a receipt for your records.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
          <h3 className="text-xl font-manrope font-bold text-primary mb-2">How can I volunteer?</h3>
          <p className="font-publicSans text-gray-700">We welcome volunteers! Please visit our Contact page and fill out the form, selecting &apos;Volunteer&apos; as the inquiry type.</p>
        </div>
      </div>
    </div>
  );
}
