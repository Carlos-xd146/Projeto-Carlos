type CardDashboardProps = { //define quais informações que o componente recebe.
  titulo: string; // apenas texto
  valor: string | number; // apeneas texto ou numero
};

export default function CardDashboard({ titulo, valor,}: CardDashboardProps) {
    
    return (
        <div className="dashboard-card">
            <h3>{titulo}</h3>
            <p className="card-numero">{valor}</p>
        </div>
    );

}

