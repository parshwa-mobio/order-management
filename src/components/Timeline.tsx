interface TimelineEvent {
  status: string;
  date: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative">
      {events.map((event, index) => (
        <div key={index} className="flex gap-4 pb-8 last:pb-0">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            {index !== events.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200"></div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{event.status}</span>
              <span className="text-sm text-gray-500">{event.date}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
