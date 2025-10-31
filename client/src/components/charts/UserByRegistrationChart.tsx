import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Profile } from '../../api/api';

// Register all required components for Line chart including Filler
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title,
  Filler
);

interface UserByRegistrationLineChartProps {
  users: Profile[];
}

export const UserByRegistrationLineChart = ({ users }: UserByRegistrationLineChartProps) => {
  // Process user data to get registrations by week across all time
  const processUserData = (users: Profile[]) => {
    if (users.length === 0) {
      return { labels: [], data: [] };
    }

    // Get all registration dates and sort them
    const registrationDates = users
      .map(user => new Date(user.created_at))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    if (registrationDates.length === 0) {
      return { labels: [], data: [] };
    }

    // Find the earliest and latest dates
    const earliestDate = new Date(registrationDates[0]);
    const latestDate = new Date(registrationDates[registrationDates.length - 1]);

    // Set earliest date to the start of its week (Monday)
    const startDate = new Date(earliestDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + (startDate.getDay() === 0 ? -6 : 1));
    startDate.setHours(0, 0, 0, 0);

    // Set latest date to the end of its week (Sunday)
    const endDate = new Date(latestDate);
    endDate.setDate(endDate.getDate() + (7 - endDate.getDay()) % 7);
    endDate.setHours(23, 59, 59, 999);

    // Create weekly buckets
    const weeklyData: { [key: string]: number } = {};
    const weekLabels: string[] = [];
    
    let currentWeekStart = new Date(startDate);
    
    while (currentWeekStart <= endDate) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekKey = currentWeekStart.toISOString().split('T')[0];
      const weekLabel = `${currentWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      
      weeklyData[weekKey] = 0;
      weekLabels.push(weekLabel);
      
      // Move to next week
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    // Count registrations per week
    registrationDates.forEach(date => {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (weeklyData[weekKey] !== undefined) {
        weeklyData[weekKey]++;
      }
    });

    const data = Object.values(weeklyData);

    return { labels: weekLabels, data };
  };

  const { labels, data } = processUserData(users);

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'User Registrations',
      data: data,
      borderColor: '#60A5FA',
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#60A5FA',
      pointBorderColor: '#F2F2F2',
      pointBorderWidth: 2,
      pointRadius: 4,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'User Registrations Over Time (Weekly)',
        color: '#BFBFBF'
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: (context: any) => {
            return `Week of ${labels[context[0].dataIndex]}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Weeks',
          color: '#BFBFBF'
        },
        grid: {
          color: '#BFBFBF',
          borderColor: '#BFBFBF'
        },
        ticks: {
          maxTicksLimit: 10, // Limit number of labels shown
          callback: function(value: any, index: number) {
            // Show every 4th label to prevent overcrowding
            return index % 4 === 0 ? labels[index] : '';
          }
        }
      },
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Users',
          color: '#BFBFBF'
        },
        grid: {
          color: '#BFBFBF',
          borderColor: '#BFBFBF',
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    }
  };

  return (
    <div style={{ position: 'relative', height: '400px' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}