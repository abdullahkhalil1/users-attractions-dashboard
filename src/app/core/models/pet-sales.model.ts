interface DataSetType {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
};

export interface SeriesType {
    data: number[];
    name: string;
};

export interface ChartData {
    labels: string[];
    datasets: DataSetType[]
}

export interface DailySale {
    animal: string,
    date: Date,
    price: string
}