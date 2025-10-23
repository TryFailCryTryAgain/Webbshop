import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Colors, BarController } from 'chart.js';
import { color } from 'chart.js/helpers';
import { Line } from 'react-chartjs-2';

// Register all required components for Line chart
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  Title
);

export const UserByRegistrationLineChart = () => {
  // Sample data for user registration over months
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'User Registrations',
      data: [65, 59, 80, 81, 56, 55, 40, 75, 90, 120, 110, 130], // Sample data
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
        text: 'User Registrations Over Time',
        color: '#BFBFBF'
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Months',
          color: '#BFBFBF'
        },
        grid: {
            color: '#BFBFBF',
            borderColor: '#BFBFBF'
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
      <Line data={data} options={options} />
    </div>
  )
}