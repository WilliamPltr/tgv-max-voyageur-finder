
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from './DateRangePicker';
import { ArrowRightLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DateRange } from 'react-day-picker'; // Import DateRange from react-day-picker

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
  const [departureStation, setDepartureStation] = useState<string>('');
  const [arrivalZone, setArrivalZone] = useState<string>('');
  const [arrivalStation, setArrivalStation] = useState<string>('');

  const handleInvertCriteria = () => {
    // Swap departure and arrival zones
    const tempZone = departureZone;
    setDepartureZone(arrivalZone);
    setArrivalZone(tempZone);

    // Swap departure and arrival stations
    const tempStation = departureStation;
    setDepartureStation(arrivalStation);
    setArrivalStation(tempStation);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      departureRange,
      returnRange,
      departureZone,
      departureStation,
      arrivalZone,
      arrivalStation,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#002B5C]">Recherche de trajets TGV Max</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleInvertCriteria}
                aria-label="Inverser aller/retour"
              >
                <ArrowRightLeft className="h-5 w-5 text-[#002B5C]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Inverser aller/retour</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Label htmlFor="departure-dates" className="block mb-2 text-sm font-medium">
              Dates aller
            </Label>
            <DateRangePicker 
              id="departure-dates"
              dateRange={departureRange}
              onDateRangeChange={setDepartureRange}
              placeholder="Sélectionnez une plage de dates aller"
            />
          </div>

          <div>
            <Label htmlFor="return-dates" className="block mb-2 text-sm font-medium">
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
            <Label htmlFor="departure-zone" className="block mb-2 text-sm font-medium">
              Zone de départ
            </Label>
            <Select 
              value={departureZone} 
              onValueChange={value => {
                setDepartureZone(value);
                setDepartureStation('');
              }}
            >
              <SelectTrigger id="departure-zone" className="w-full">
                <SelectValue placeholder="Aucune" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                {zones.map(zone => (
                  <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="departure-station" className="block mb-2 text-sm font-medium">
              Départ spécifique (optionnel)
            </Label>
            <Select 
              value={departureStation} 
              onValueChange={setDepartureStation}
              disabled={!departureZone}
            >
              <SelectTrigger id="departure-station" className="w-full">
                <SelectValue placeholder="Sélectionnez une gare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les gares</SelectItem>
                {departureZone && stationsByZone[departureZone as keyof typeof stationsByZone]?.map(station => (
                  <SelectItem key={station.id} value={station.id}>{station.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Vous pouvez laisser vide la zone de départ si vous choisissez un départ spécifique.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Label htmlFor="arrival-zone" className="block mb-2 text-sm font-medium">
              Zone d'arrivée
            </Label>
            <Select 
              value={arrivalZone} 
              onValueChange={value => {
                setArrivalZone(value);
                setArrivalStation('');
              }}
            >
              <SelectTrigger id="arrival-zone" className="w-full">
                <SelectValue placeholder="Aucune" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                {zones.map(zone => (
                  <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="arrival-station" className="block mb-2 text-sm font-medium">
              Destination spécifique (optionnel)
            </Label>
            <Select 
              value={arrivalStation} 
              onValueChange={setArrivalStation}
              disabled={!arrivalZone}
            >
              <SelectTrigger id="arrival-station" className="w-full">
                <SelectValue placeholder="Sélectionnez une gare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les gares</SelectItem>
                {arrivalZone && stationsByZone[arrivalZone as keyof typeof stationsByZone]?.map(station => (
                  <SelectItem key={station.id} value={station.id}>{station.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">Vous pouvez laisser vide la zone d'arrivée si vous choisissez une destination spécifique.</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <Button 
            type="submit" 
            className="bg-[#00B2E3] hover:bg-[#0099cc] text-white w-32" 
          >
            Aller
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="border-[#002B5C] text-[#002B5C] hover:bg-[#F6F6F6] w-32" 
          >
            Retour
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
