
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface Trip {
  id: string;
  date: string;
  time: string;
  departureZone: string;
  departureStation: string;
  arrivalZone: string;
  arrivalStation: string;
  trainRef: string;
}

interface ResultsTableProps {
  results: Trip[];
}

const ITEMS_PER_PAGE = 10;

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, results.length);
  const currentResults = results.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const exportToCSV = () => {
    // Headers for CSV
    const headers = [
      'Date',
      'Heure Départ',
      'Zone Départ',
      'Gare Départ',
      'Zone Arrivée',
      'Gare Arrivée',
      'Réf. Train',
    ];

    // Convert data to CSV format
    const csvData = results.map((trip) => [
      trip.date,
      trip.time,
      trip.departureZone,
      trip.departureStation,
      trip.arrivalZone,
      trip.arrivalStation,
      trip.trainRef,
    ]);

    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(',')),
    ].join('\n');

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tgvmax-results-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#002B5C]">
          Résultats ({results.length > 50 ? '50+' : results.length})
        </h2>
        <Button 
          onClick={exportToCSV} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={results.length === 0}
        >
          <Download size={16} />
          Exporter en CSV
        </Button>
      </div>

      {results.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F6F6F6] sticky top-0">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure Départ</TableHead>
                  <TableHead>Zone Départ</TableHead>
                  <TableHead>Gare Départ</TableHead>
                  <TableHead>Zone Arrivée</TableHead>
                  <TableHead>Gare Arrivée</TableHead>
                  <TableHead>Réf. Train</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentResults.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>{trip.date}</TableCell>
                    <TableCell>{trip.time}</TableCell>
                    <TableCell>{trip.departureZone}</TableCell>
                    <TableCell>{trip.departureStation}</TableCell>
                    <TableCell>{trip.arrivalZone}</TableCell>
                    <TableCell>{trip.arrivalStation}</TableCell>
                    <TableCell>{trip.trainRef}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                précédent
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                suivant
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center text-gray-500">
          Aucun trajet trouvé
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
