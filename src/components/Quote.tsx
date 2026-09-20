import { useEffect, useState } from "react";

const taglines = [
  "Every thought has a story.",
  "Some thoughts deserve to be written.",
  "Where thoughts become stories.",
  "Give your thoughts a voice.",
  "Write the story only you can tell.",
  "Every story begins with a thought.",
  "Words create worlds.",
  "Write freely. Think deeply.",
  "Ideas grow when they are shared.",
  "Every word leaves a mark.",
  "Turn thoughts into something lasting.",
  "Where ideas find their voice.",
  "Thoughts worth putting into words.",
  "Discover new perspectives.",
  "Your perspective matters.",
  "Every voice has a story.",
  "Read deeply. Write freely.",
  "Let your words find their way.",
  "Turn a thought into a story.",
  "Write today. Leave something behind.",
  "One thought can become a thousand words.",
  "A space for thoughts worth sharing.",
  "Stories begin with a single thought.",
  "Words have the power to connect.",
  "Make your thoughts memorable.",
  "Read. Reflect. Write.",
  "Your thoughts. Your words. Your story.",
  "Every thought deserves an Akshar.",
  "Every story begins with an Akshar.",
  "Where every Akshar tells a story.",
];

export const Quote = () => {

    const [tagline, setTagline] = useState(taglines[0]);

    useEffect(() => {
      const interval = setInterval(() => {
        setTagline(
          taglines[Math.floor(Math.random() * taglines.length)]
        );
      }, 3000);

      return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="h-full flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="max-w-lg">
                    <div className="text-3xl font-bold">
                        "{tagline}"
                    </div>
                
                    <div className="max-w-md text-xl font-semibold mt-4">
                        Yuvraj Sharma
                    </div>
                    <div className="max-w-md text-sm font-semibold text-slate-300">
                        - Creator & Founder
                    </div>
                </div>
            </div>
           
        </div>
    )
}