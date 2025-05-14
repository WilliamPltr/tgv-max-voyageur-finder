
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from './DateRangePicker';
import { ArrowRightLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DateRange } from 'react-day-picker'; // Import DateRange from react-day-picker
import { Checkbox } from '@/components/ui/checkbox';

// Updated zones data from user provided information
const zones = [
  { id: 'paris', name: 'Paris' },
  { id: 'lyon', name: 'Lyon' },
  { id: 'marseille_provence', name: 'Marseille Provence' },
  { id: 'lille_metropole', name: 'Lille Métropole' },
  { id: 'bordeaux', name: 'Bordeaux' },
  { id: 'toulouse', name: 'Toulouse' },
  { id: 'nice_cote_dazur', name: 'Nice Côte d\'Azur' },
  { id: 'strasbourg', name: 'Strasbourg' },
  { id: 'rennes', name: 'Rennes' },
  { id: 'montpellier', name: 'Montpellier' },
  { id: 'avignon', name: 'Avignon' },
  { id: 'valence', name: 'Valence' },
  { id: 'besancon', name: 'Besançon' },
  { id: 'macon', name: 'Mâcon' },
];

// Updated stations per zone based on provided data
const stationsByZone = {
  paris: [
    { id: 'paris-intramuros', name: 'PARIS (intramuros)' },
    { id: 'paris-montparnasse', name: 'PARIS MONTPARNASSE VAUGIRARD' },
    { id: 'roissy-cdg', name: 'AEROPORT ROISSY CDG 2 TGV' },
    { id: 'marne-la-vallee', name: 'MARNE LA VALLEE CHESSY' },
    { id: 'massy-palaiseau', name: 'MASSY PALAISEAU' },
    { id: 'massy-tgv', name: 'MASSY TGV' },
    { id: 'versailles-chantiers', name: 'VERSAILLES CHANTIERS' },
    { id: 'mantes-la-jolie', name: 'MANTES LA JOLIE' },
  ],
  lyon: [
    { id: 'lyon-intramuros', name: 'LYON (intramuros)' },
    { id: 'lyon-st-exupery', name: 'LYON ST EXUPERY TGV.' },
  ],
  marseille_provence: [
    { id: 'marseille-st-charles', name: 'MARSEILLE ST CHARLES' },
    { id: 'marseille-blancarde', name: 'MARSEILLE BLANCARDE' },
    { id: 'aix-en-provence-tgv', name: 'AIX EN PROVENCE TGV' },
    { id: 'miramas', name: 'MIRAMAS' },
  ],
  lille_metropole: [
    { id: 'lille-intramuros', name: 'LILLE (intramuros)' },
    { id: 'tourcoing', name: 'TOURCOING' },
    { id: 'roubaix', name: 'ROUBAIX' },
    { id: 'croix-wasquehal', name: 'CROIX WASQUEHAL' },
    { id: 'douai', name: 'DOUAI' },
    { id: 'hazebrouck', name: 'HAZEBROUCK' },
    { id: 'lens', name: 'LENS' },
    { id: 'arras', name: 'ARRAS' },
    { id: 'valenciennes', name: 'VALENCIENNES' },
  ],
  bordeaux: [
    { id: 'bordeaux-st-jean', name: 'BORDEAUX ST JEAN' },
    { id: 'libourne', name: 'LIBOURNE' },
    { id: 'biganos-facture', name: 'BIGANOS FACTURE' },
    { id: 'la-teste', name: 'LA TESTE' },
    { id: 'arcachon', name: 'ARCACHON' },
  ],
  toulouse: [
    { id: 'toulouse-matabiau', name: 'TOULOUSE MATABIAU' },
    { id: 'montauban-ville-bourbon', name: 'MONTAUBAN VILLE BOURBON' },
  ],
  nice_cote_dazur: [
    { id: 'nice-ville', name: 'NICE VILLE' },
    { id: 'antibes', name: 'ANTIBES' },
    { id: 'cannes', name: 'CANNES' },
  ],
  strasbourg: [
    { id: 'strasbourg', name: 'STRASBOURG' },
    { id: 'selestat', name: 'SELESTAT' },
  ],
  rennes: [
    { id: 'rennes', name: 'RENNES' },
    { id: 'vitre', name: 'VITRE' },
  ],
  montpellier: [
    { id: 'montpellier-saint-roch', name: 'MONTPELLIER SAINT ROCH' },
    { id: 'montpellier-sud-de-france', name: 'MONTPELLIER SUD DE FRANCE' },
  ],
  avignon: [
    { id: 'avignon-centre', name: 'AVIGNON CENTRE' },
    { id: 'avignon-tgv', name: 'AVIGNON TGV' },
  ],
  valence: [
    { id: 'valence-ville', name: 'VALENCE VILLE' },
    { id: 'valence-tgv', name: 'VALENCE TGV' },
  ],
  besancon: [
    { id: 'besancon-viotte', name: 'BESANCON VIOTTE' },
    { id: 'besancon-franche-comte-tgv', name: 'BESANCON FRANCHE COMTE TGV' },
  ],
  macon: [
    { id: 'macon-ville', name: 'MACON VILLE' },
    { id: 'macon-loche-tgv', name: 'MACON LOCHE TGV' },
  ],
};

interface SearchFormProps {
  onSearch: (criteria: any) => void;
}

// Using the DateRange from react-day-picker
const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [departureRange, setDepartureRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [returnRange, setReturnRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [departureZone, setDepartureZone] = useState<string>('');
  const [selectedDepartureStations, setSelectedDepartureStations] = useState<string[]>([]);
  const [arrivalZone, setArrivalZone] = useState<string>('');
  const [arrivalStation, setArrivalStation] = useState<string>('');

  const handleInvertCriteria = () => {
    // Swap departure and arrival zones
    const tempZone = departureZone;
    setDepartureZone(arrivalZone);
    setArrivalZone(tempZone);

    // Swap departure and arrival stations
    const tempStation = selectedDepartureStations.length > 0 ? selectedDepartureStations[0] : '';
    setSelectedDepartureStations(arrivalStation ? [arrivalStation] : []);
    setArrivalStation(tempStation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      departureRange,
      returnRange,
      departureZone,
      departureStations: selectedDepartureStations,
      arrivalZone,
      arrivalStation,
    });
  };

  const toggleDepartureStation = (stationId: string) => {
    setSelectedDepartureStations(prev => {
      if (prev.includes(stationId)) {
        return prev.filter(id => id !== stationId);
      } else {
        return [...prev, stationId];
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto mb-8 border border-[#E0E7FF]">
      <div className="bg-gradient-to-r from-[#002B5C] to-[#00B2E3] -mx-6 -mt-6 px-6 py-4 rounded-t-xl mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Recherche de trajets TGV Max</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleInvertCriteria}
                aria-label="Inverser aller/retour"
                className="text-white hover:bg-white/20"
              >
                <ArrowRightLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#002B5C] text-white border-none shadow-lg">
              <p>Inverser aller/retour</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-[#F6F6F6] p-4 rounded-lg shadow-sm">
            <Label htmlFor="departure-dates" className="block mb-2 text-sm font-medium text-[#002B5C]">
              Dates aller
            </Label>
            <DateRangePicker 
              id="departure-dates"
              dateRange={departureRange}
              onDateRangeChange={setDepartureRange}
              placeholder="Sélectionnez une plage de dates aller"
            />
          </div>

          <div className="bg-[#F6F6F6] p-4 rounded-lg shadow-sm">
            <Label htmlFor="return-dates" className="block mb-2 text-sm font-medium text-[#002B5C]">
              Dates retour (optionnel)
            </Label>
            <DateRangePicker 
              id="return-dates"
              dateRange={returnRange}
              onDateRangeChange={setReturnRange}
              placeholder="Sélectionnez une plage de dates retour"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Label htmlFor="departure-zone" className="block mb-2 text-sm font-medium text-[#002B5C]">
              Zone de départ
            </Label>
            <Select 
              value={departureZone} 
              onValueChange={value => {
                setDepartureZone(value);
                setSelectedDepartureStations([]);
              }}
            >
              <SelectTrigger id="departure-zone" className="w-full border-[#E0E7FF] focus:ring-[#00B2E3]">
                <SelectValue placeholder="Aucune" />
              </SelectTrigger>
              <SelectContent className="border-[#E0E7FF]">
                <SelectItem value="none">Aucune</SelectItem>
                {zones.map(zone => (
                  <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="departure-station" className="block mb-2 text-sm font-medium text-[#002B5C]">
              Départ spécifique (optionnel)
            </Label>
            
            <div className="max-h-36 overflow-y-auto rounded-lg border border-[#E0E7FF] bg-white p-2">
              {departureZone && departureZone !== 'none' ? (
                stationsByZone[departureZone as keyof typeof stationsByZone]?.map(station => (
                  <div key={station.id} className="flex items-center space-x-2 p-2 hover:bg-[#F6F6F6] rounded">
                    <Checkbox 
                      id={`station-${station.id}`} 
                      checked={selectedDepartureStations.includes(station.id)}
                      onCheckedChange={() => toggleDepartureStation(station.id)}
                    />
                    <label 
                      htmlFor={`station-${station.id}`}
                      className="text-sm cursor-pointer flex-grow"
                    >
                      {station.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-2">Sélectionnez d'abord une zone</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Label htmlFor="arrival-zone" className="block mb-2 text-sm font-medium text-[#002B5C]">
              Zone d'arrivée
            </Label>
            <Select 
              value={arrivalZone} 
              onValueChange={value => {
                setArrivalZone(value);
                setArrivalStation('');
              }}
            >
              <SelectTrigger id="arrival-zone" className="w-full border-[#E0E7FF] focus:ring-[#00B2E3]">
                <SelectValue placeholder="Aucune" />
              </SelectTrigger>
              <SelectContent className="border-[#E0E7FF]">
                <SelectItem value="none">Aucune</SelectItem>
                {zones.map(zone => (
                  <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="arrival-station" className="block mb-2 text-sm font-medium text-[#002B5C]">
              Destination spécifique (optionnel)
            </Label>
            <Select 
              value={arrivalStation} 
              onValueChange={setArrivalStation}
              disabled={!arrivalZone || arrivalZone === 'none'}
            >
              <SelectTrigger id="arrival-station" className="w-full border-[#E0E7FF] focus:ring-[#00B2E3]">
                <SelectValue placeholder="Sélectionnez une gare" />
              </SelectTrigger>
              <SelectContent className="border-[#E0E7FF]">
                <SelectItem value="all">Toutes les gares</SelectItem>
                {arrivalZone && arrivalZone !== 'none' && stationsByZone[arrivalZone as keyof typeof stationsByZone]?.map(station => (
                  <SelectItem key={station.id} value={station.id}>{station.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-[#00B2E3] to-[#0099cc] hover:from-[#0099cc] hover:to-[#0088bb] text-white w-32 shadow-md transition-all transform hover:scale-105" 
          >
            Rechercher
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#002B5C] text-[#002B5C] hover:bg-[#F6F6F6] w-32 shadow-sm transition-all transform hover:scale-105" 
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
