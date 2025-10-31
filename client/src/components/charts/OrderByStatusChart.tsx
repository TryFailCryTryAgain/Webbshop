import { Chart as ChartJS, ArcElement, Tooltip, Legend, plugins } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { Order } from '../../api/api';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OrderByStatusDonutChartProps {
    orders: Order[];
}

export const OrderByStatusDonutChart: React.FC<OrderByStatusDonutChartProps> = ({
    orders
}) => {

    const [delivered, setDelivered] = useState<number | null>(null);
    const [processing, setProcessing] = useState<number | null>(null);
    const [pending, setPending] = useState<number | null>(null);

    useEffect(() => {
        function separateData() {
            let del = 0;
            let proc = 0;
            let pen = 0;

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

            orders.forEach(order => {
                // Assuming order.delivery_date is a Date object or timestamp
                const deliveryDate = new Date(order.delivery_date);
                deliveryDate.setHours(0, 0, 0, 0); // Set to start of day
                
                // Calculate difference in days
                const diffTime = deliveryDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 0) {
                    // Delivery date is in the past
                    del += 1;
                } else if (diffDays >= 0 && diffDays <= 5) {
                    // Delivery within 0-3 days (today, tomorrow, day after tomorrow)
                    proc += 1;
                } else if (diffDays > 5) {
                    // Delivery more than 3 days away
                    pen += 1;
                }
            });

            setDelivered(del);
            setPending(pen);
            setProcessing(proc);
        }

        separateData();
    }, [orders]);

    const data = {
        datasets: [{
            data: [delivered, processing, pending].map(val => val || 0), // Handle null values
            backgroundColor: [
                '#34D399',
                '#60A5FA',
                '#FBBF24',
                '#F87171' 
            ],
            borderWidth: 1,
        }],
        labels: ['Delivered','Processing', 'Pending']
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
                label: function(context: any) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
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