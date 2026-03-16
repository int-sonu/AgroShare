import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">About AgroShare</h1>

        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
          AgroShare is a digital platform designed to connect farmers with modern agricultural
          machinery. Our goal is to make advanced farming equipment accessible, affordable, and easy
          to find for farmers across different regions.
        </p>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Image
              src="/images/about.png"
              alt="Agriculture"
              width={500}
              height={350}
              className="rounded-xl"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>

            <p className="text-gray-600 mb-4">
              Our mission is to empower farmers by providing access to modern agricultural equipment
              and technology. We aim to reduce the gap between equipment providers and farmers by
              creating a reliable online marketplace.
            </p>

            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>

            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="text-green-600 w-5 h-5" />
                Easy machine rental and purchase
              </li>

              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="text-green-600 w-5 h-5" />
                Verified sellers and equipment
              </li>

              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="text-green-600 w-5 h-5" />
                Affordable farming solutions
              </li>

              <li className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="text-green-600 w-5 h-5" />A trusted platform for farmers
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
