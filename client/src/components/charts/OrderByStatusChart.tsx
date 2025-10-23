import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);


export const OrderByStatusDonutChart = () => {
    const data = {
        datasets: [{
            data: [45, 25, 20, 10], // Here is the point where the data from the database will be inserted
            backgroundColor: [
                '#34D399',
                '#60A5FA',
                '#FBBF24',
                '#F87171' 
            ],
            borderWidth: 1,
        }],
        labels: ['Delivered','Processing', 'Pending', 'Cancelled']
    }

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12,
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'rect',
                    color: '#BFBFBF'
                }
                
            },
            title: {
                display: true,
                text: 'Orders by Status',
                color: '#BFBFBF',
                position: 'top' as const
            }
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = Math.round((value / total) * 100);
                    return `${label}: ${value} (${percentage}%)`
                }
            }
        },
        maintainAspectRatio: false,
        cutout: '60%'
    }


    return (
        <Doughnut data={data} options={options}/>
    )
}

