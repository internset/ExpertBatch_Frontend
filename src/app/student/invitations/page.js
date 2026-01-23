'use client';

import { FiAward } from 'react-icons/fi';

export default function InvitationsPage() {
  const invitations = [
    {
      id: 1,
      title: 'UI/UX Screening Test',
      icon: FiAward,
      iconColor: 'green',
      organisation: 'DesignLabs',
      deadline: 'Jan 28, 2026',
    },
  ];

  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Invitations</h1>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${
                  invitation.iconColor === 'green' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <invitation.icon className={`h-6 w-6 ${
                    invitation.iconColor === 'green' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{invitation.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">Organisation: <span className="font-medium">{invitation.organisation}</span></p>
                  <p className="text-sm text-gray-600 mb-1">Deadline: <span className="font-medium">{invitation.deadline}</span></p>
                </div>
              </div>
              <div className="flex gap-3">
                      <button className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                        Accept
                      </button>
                      <button className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
