import { useMemo } from 'react';

export type ChallengeType = 'Gauntlet' | 'Ascendant' | 'Standard';

interface MetricsProps {
  type: ChallengeType;
  amount: string;
}

interface StepMetrics {
  "Initial Balance": string;
  "Profit Target"?: string;
  "Evaluation Target"?: string;
  "Max Loss": string;
  "Max Daily Loss": string;
  "Leverage": string;
  "Time Limit": string;
  "Profit Share": string;
  "Bonus"?: string;
  "Cost"?: string;
  "One Time Fee"?: string;
  [key: string]: string | undefined;
}

interface ChallengeSteps {
  "STEP 1": StepMetrics;
  "STEP 2"?: StepMetrics;
  "STEP 3"?: StepMetrics;
  "FUNDED": StepMetrics;
  [key: string]: StepMetrics | undefined;
}

interface ChallengeAmount {
  steps: ChallengeSteps;
  price: string;
}

type ChallengeAmounts = {
  [key: string]: ChallengeAmount;
};

type PerformanceMetrics = {
  [K in ChallengeType]: ChallengeAmounts;
};

export const performanceMetrics: PerformanceMetrics = {
  Gauntlet: {
    "$50,000": {
      price: "50",
      steps: {
        "STEP 1": {
          "Initial Balance": "$50,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "5% DISCOUNT",
          "Cost": "$50",
        },
        "STEP 2": {
          "Initial Balance": "$50,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "-",
          "Cost": "-",
        },
        "STEP 3": {
          "Initial Balance": "$50,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "-",
          "Cost": "-",
        },
        "FUNDED": {
          "Initial Balance": "$50,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "3%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "UP TO 100%",
          "Bonus": "-",
          "Cost": "$150",
        },
      },
    },
    "$100,000": {
      price: "100",
      steps: {
        "STEP 1": {
          "Initial Balance": "$100,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "5% DISCOUNT",
          "Cost": "$100",
        },
        "STEP 2": {
          "Initial Balance": "$100,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "-",
          "Cost": "-",
        },
        "STEP 3": {
          "Initial Balance": "$100,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "-",
          "Cost": "-",
        },
        "FUNDED": {
          "Initial Balance": "$100,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "3%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "UP TO 100%",
          "Bonus": "-",
          "Cost": "$300",
        },
      },
    },
    "$300,000": {
      price: "250",
      steps: {
        "STEP 1": {
          "Initial Balance": "$300,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "5% DISCOUNT",
          "Cost": "$250",
        },
        "STEP 2": {
          "Initial Balance": "$300,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "-",
          "Cost": "-",
        },
        "STEP 3": {
          "Initial Balance": "$300,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "-",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Bonus": "-",
          "Cost": "-",
        },
        "FUNDED": {
          "Initial Balance": "$300,000",
          "Profit Target": "6%",
          "Max Loss": "6%",
          "Max Daily Loss": "3%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "UP TO 100%",
          "Bonus": "-",
          "Cost": "$750",
        },
      },
    },
  },
  Ascendant: {
    "$10,000": {
      price: "250",
      steps: {
        "STEP 1": {
          "Initial Balance": "$10,000",
          "Evaluation Target": "10%",
          "Max Loss": "8%",
          "Max Daily Loss": "4%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "up to 100%",
          "Bonus": "From $15",
          "One Time Fee": "$250"
        },
        "FUNDED": {
          "Initial Balance": "$10,000",
          "Evaluation Target": "10%",
          "Max Loss": "8%",
          "Max Daily Loss": "4%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "up to 100%",
          "Bonus": "-",
          "One Time Fee": "-"
        }
      }
    },
    "$25,000": {
      price: "500",
      steps: {
        "STEP 1": {
          "Initial Balance": "$25,000",
          "Evaluation Target": "10%",
          "Max Loss": "8%",
          "Max Daily Loss": "4%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "up to 100%",
          "Bonus": "From $25",
          "One Time Fee": "$500"
        },
        "FUNDED": {
          "Initial Balance": "$25,000",
          "Evaluation Target": "10%",
          "Max Loss": "8%",
          "Max Daily Loss": "4%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "up to 100%",
          "Bonus": "-",
          "One Time Fee": "-"
        }
      }
    },
    "$50,000": {
      price: "1000",
      steps: {
        "STEP 1": {
          "Initial Balance": "$50,000",
          "Evaluation Target": "10%",
          "Max Loss": "8%",
          "Max Daily Loss": "4%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "up to 100%",
          "Bonus": "From $50",
          "One Time Fee": "$1000"
        },
        "FUNDED": {
          "Initial Balance": "$50,000",
          "Evaluation Target": "10%",
          "Max Loss": "8%",
          "Max Daily Loss": "4%",
          "Leverage": "1:50",
          "Time Limit": "UNLIMITED",
          "Profit Share": "up to 100%",
          "Bonus": "-",
          "One Time Fee": "-"
        }
      }
    }
  },
  Standard: {
    "$10,000": {
      price: "100",
      steps: {
        "STEP 1": {
          "Initial Balance": "$10,000",
          "Profit Target": "8%",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Cost": "$100"
        },
        "STEP 2": {
          "Initial Balance": "$10,000",
          "Profit Target": "5%",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Cost": "-"
        },
        "FUNDED": {
          "Initial Balance": "$10,000",
          "Profit Target": "10% for scaling",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "Up to 100%",
          "Cost": "-"
        }
      }
    },
    "$25,000": {
      price: "200",
      steps: {
        "STEP 1": {
          "Initial Balance": "$25,000",
          "Profit Target": "8%",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Cost": "$200"
        },
        "STEP 2": {
          "Initial Balance": "$25,000",
          "Profit Target": "5%",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Cost": "-"
        },
        "FUNDED": {
          "Initial Balance": "$25,000",
          "Profit Target": "10% for scaling",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "Up to 100%",
          "Cost": "-"
        }
      }
    },
    "$50,000": {
      price: "300",
      steps: {
        "STEP 1": {
          "Initial Balance": "$50,000",
          "Profit Target": "8%",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Cost": "$300"
        },
        "STEP 2": {
          "Initial Balance": "$50,000",
          "Profit Target": "5%",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Cost": "-"
        },
        "FUNDED": {
          "Initial Balance": "$50,000",
          "Profit Target": "10% for scaling",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "Up to 100%",
          "Cost": "-"
        }
      }
    },
    "$100,000": {
      price: "450",
      steps: {
        "STEP 1": {
          "Initial Balance": "$100,000",
          "Profit Target": "8%",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Cost": "$450"
        },
        "STEP 2": {
          "Initial Balance": "$100,000",
          "Profit Target": "5%",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "-",
          "Cost": "-"
        },
        "FUNDED": {
          "Initial Balance": "$100,000",
          "Profit Target": "10% for scaling",
          "Max Loss": "10%",
          "Max Daily Loss": "6%",
          "Leverage": "1:100",
          "Time Limit": "UNLIMITED",
          "Profit Share": "Up to 100%",
          "Cost": "-"
        }
      }
    }
  },
};

export default function ChallengeMetrics({ type, amount }: MetricsProps) {
  const metrics = useMemo(() => {
    if (!type || !amount) return null;
    return performanceMetrics[type]?.[amount];
  }, [type, amount]);

  if (!metrics) {
    return (
      <div className="text-center p-8 text-gray-400">
        Select a challenge type and amount to view conditions
      </div>
    );
  }

  const steps = metrics.steps;
  const headers = Object.keys(steps);
  const rowMetrics = Object.keys(steps[headers[0]] as StepMetrics);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-[#ffc62d] bg-[#111111] sticky left-0 z-10">
              Rules
            </th>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-sm font-semibold text-[#ffc62d] bg-[#111111]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {rowMetrics.map((metric) => (
            <tr key={metric}>
              <td className="px-4 py-3 text-sm font-medium text-[#ffc62d] bg-[#111111] sticky left-0">
                {metric}
              </td>
              {headers.map((step) => {
                const stepMetrics = steps[step];
                if (!stepMetrics) return null;
                return (
                  <td
                    key={`${metric}-${step}`}
                    className={`px-4 py-3 text-sm ${
                      metric === 'Profit Share' && stepMetrics[metric] !== '-'
                        ? 'bg-[#ffc62d] bg-opacity-10 text-white'
                        : 'text-gray-300'
                    }`}
                  >
                    {stepMetrics[metric]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-gray-400">
        Important: In order to remain eligible to trade a Funded Account, always ensure that you trade in accordance with our{' '}
        <a href="#" className="text-[#ffc62d] hover:text-[#e5b228]">
          Rules and Terms & Conditions
        </a>
        .
      </p>
    </div>
  );
} 