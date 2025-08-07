import React, { useState } from 'react';
import { Plus, Search, User, Calendar, FileText } from 'lucide-react';
import { Player, WorkoutPlan } from '../types';
import { format } from 'date-fns';

interface PlayerManagementProps {
  players: Player[];
  workoutPlans: WorkoutPlan[];
  onAddPlayer: (player: Omit<Player, 'id' | 'createdAt'>) => void;
  onCreatePlan: (playerId: string, playerName: string) => void;
}

export const PlayerManagement: React.FC<PlayerManagementProps> = ({ 
  players, 
  workoutPlans, 
  onAddPlayer,
  onCreatePlan
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [newPlayer, setNewPlayer] = useState({
    fullName: '',
    email: '',
    phone: '',
    joinDate: new Date(),
  });

  const filteredPlayers = players.filter(player =>
    player.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlayerPlans = (playerId: string) => 
    workoutPlans.filter(plan => plan.playerId === playerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.fullName.trim()) {
      onAddPlayer(newPlayer);
      setNewPlayer({ fullName: '', email: '', phone: '', joinDate: new Date() });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Player Management</h1>
            <p className="text-gray-600">Manage gym members and their workout history.</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add Player
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search players by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Players List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Players ({filteredPlayers.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredPlayers.map((player) => {
              const playerPlans = getPlayerPlans(player.id);
              return (
                <div 
                  key={player.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    selectedPlayer?.id === player.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{player.fullName}</h3>
                      <p className="text-sm text-gray-500">ID: {player.id}</p>
                      <p className="text-xs text-gray-400">
                        Joined: {format(new Date(player.joinDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">{playerPlans.length} plans</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreatePlan(player.id, player.fullName);
                        }}
                        className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mt-1 hover:bg-orange-200 transition-colors"
                      >
                        Create Plan
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredPlayers.length === 0 && (
              <p className="text-gray-500 text-center py-8">No players found.</p>
            )}
          </div>
        </div>

        {/* Player Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          {selectedPlayer ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPlayer.fullName}</h2>
                  <p className="text-gray-500">Player ID: {selectedPlayer.id}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedPlayer.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{selectedPlayer.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Join Date</label>
                  <p className="text-gray-900">{format(new Date(selectedPlayer.joinDate), 'MMMM dd, yyyy')}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Workout History</h3>
                  <button
                    onClick={() => onCreatePlan(selectedPlayer.id, selectedPlayer.fullName)}
                    className="text-sm bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition-colors"
                  >
                    Create New Plan
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getPlayerPlans(selectedPlayer.id).map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {plan.categories.reduce((total, cat) => total + cat.exercises.length, 0)} exercises
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(plan.date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Calendar size={14} className="text-gray-400" />
                    </div>
                  ))}
                  {getPlayerPlans(selectedPlayer.id).length === 0 && (
                    <p className="text-gray-500 text-center py-4 text-sm">No workout plans yet</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <User size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Select a player to view details and workout history</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Player Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 my-8">
            <h2 className="text-xl font-semibold mb-4">Add New Player</h2>
            <form onSubmit={handleAddPlayer}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newPlayer.fullName}
                  onChange={(e) => setNewPlayer({ ...newPlayer, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newPlayer.email}
                  onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newPlayer.phone}
                  onChange={(e) => setNewPlayer({ ...newPlayer, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </label>
                <input
                  type="date"
                  value={newPlayer.joinDate.toISOString().split('T')[0]}
                  onChange={(e) => setNewPlayer({ ...newPlayer, joinDate: new Date(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};