
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateRangePicker from './DateRangePicker';
import { ArrowRightLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock data for zones and stations
const zones = [
  { id: 'paris', name: 'Paris' },
  { id: 'lyon', name: 'Lyon' },
  { id: 'marseille', name: 'Marseille' },
  { id: 'lille', name: 'Lille' },
  { id: 'bordeaux', name: 'Bordeaux' },
];

// Mock stations per zone
const stationsByZone = {
  paris: [
    { id: 'paris-gare-de-lyon', name: 'Paris Gare de Lyon' },
    { id: 'paris-montparnasse', name: 'Paris Montparnasse' },
    { id: 'paris-nord', name: 'Paris Nord' },
    { id: 'paris-est', name: 'Paris Est' },
  ],
  lyon: [
    { id: 'lyon-part-dieu', name: 'Lyon Part-Dieu' },
    { id: 'lyon-perrache', name: 'Lyon Perrache' },
  ],
  marseille: [
    { id: 'marseille-saint-charles', name: 'Marseille Saint-Charles' },
  ],
  lille: [
    { id: 'lille-europe', name: 'Lille Europe' },
    { id: 'lille-flandres', name: 'Lille Flandres' },
  ],
  bordeaux: [
    { id: 'bordeaux-saint-jean', name: 'Bordeaux Saint-Jean' },
  ],
};

interface SearchFormProps {
  onSearch: (criteria: any) => void;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

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
                <SelectItem value="">Aucune</SelectItem>
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
                <SelectItem value="">Toutes les gares</SelectItem>
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
                <SelectItem value="">Aucune</SelectItem>
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
                <SelectItem value="">Toutes les gares</SelectItem>
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
