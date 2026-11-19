import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Play, 
  Pause, 
  TrendingUp, 
  Users, 
  Video, 
  Volume2, 
  VolumeX, 
  Sparkles 
} from 'lucide-react';

interface Comment {
  id: string;
  user: string;
  text: string;
  timeAgo: string;
  likes: number;
}

export const ReelsView: React.FC<{ onNavigateToCourts: () => void }> = ({ onNavigateToCourts }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1247);
  const [newCommentText, setNewCommentText] = useState('');
  const [activeTrend, setActiveTrend] = useState('#ChillanFutbol');

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      user: 'usuario1',
      text: '¡Qué golazo! 🔥',
      timeAgo: 'Hace 2h',
      likes: 14
    },
    {
      id: 'c2',
      user: 'futbolero_pro',
      text: 'La mejor cancha de Chillán sin duda',
      timeAgo: 'Hace 1h',
      likes: 8
    },
    {
      id: 'c3',
      user: 'marcelo_chillan',
      text: 'Tremendo partido anoche en las canchas de pasto sintético techadas 🎾⚽',
      timeAgo: 'Hace 30 min',
      likes: 5
    }
  ]);

  const trends = ['#ChillanFutbol', '#Golazo', '#Torneo', '#Deporte', '#Cancha'];

  const featuredUsers = [
    { name: 'Carlos_Futbol', followers: '1.2k seguidores', avatarColor: 'bg-emerald-500' },
    { name: 'Chillan_Deportes', followers: '3.5k seguidores', avatarColor: 'bg-blue-500' },
    { name: 'Padel_Nuble_Pro', followers: '2.8k seguidores', avatarColor: 'bg-amber-500' }
  ];

  const handleToggleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      user: 'tú (jugador)',
      text: newCommentText.trim(),
      timeAgo: 'Recién',
      likes: 0
    };

    setComments(prev => [newComment, ...prev]);
    setNewCommentText('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CONTENEDOR PRINCIPAL REELS (Imagen 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: Tendencias y Usuarios Destacados */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-[#22c55e]">Reels de Chillán</h2>
            <p className="text-xs text-slate-400 mt-0.5">La comunidad deportiva en acción</p>
          </div>

          {/* Tendencias */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Tendencias
            </span>
            <div className="flex flex-wrap gap-2">
              {trends.map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTrend(t)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeTrend === t
                      ? 'bg-[#22c55e] text-slate-950 font-bold'
                      : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Usuarios Destacados */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Usuarios destacados
            </span>
            <div className="space-y-2.5">
              {featuredUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-900 transition-colors">
                  <div className={`w-8 h-8 rounded-full ${u.avatarColor} text-slate-950 flex items-center justify-center font-bold text-xs`}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white hover:text-[#22c55e] cursor-pointer">
                      {u.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{u.followers}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA CENTRAL: Reproductor Vertical de Reel (9:16) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-black flex flex-col justify-between group">
            {/* Imagen/Video de fondo */}
            <img
              src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop"
              alt="Reel Deportivo"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none"></div>

            {/* Control Play/Pause central al hover */}
            <div 
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            >
              {!isPlaying && (
                <div className="w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
              )}
            </div>

            {/* Header del Reel */}
            <div className="relative z-10 p-4 flex items-center justify-between text-white text-xs">
              <span className="px-2 py-0.5 rounded-full bg-black/50 text-[10px] font-mono border border-white/20">
                LIVE REEL
              </span>
              <button 
                onClick={onNavigateToCourts}
                className="px-2.5 py-1 rounded-full bg-[#22c55e] text-slate-950 font-bold text-[10px] cursor-pointer"
              >
                Arrendar Cancha
              </button>
            </div>

            {/* Botones de Interacción a la Derecha */}
            <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white text-xs">
              {/* Like */}
              <button
                onClick={handleToggleLike}
                className="flex flex-col items-center gap-1 cursor-pointer group/btn"
              >
                <div className={`p-2.5 rounded-full bg-black/40 backdrop-blur-md transition-transform group-hover/btn:scale-110 ${
                  isLiked ? 'text-rose-500' : 'text-white'
                }`}>
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                </div>
                <span className="font-mono text-[11px] font-bold text-white drop-shadow">
                  {likesCount}
                </span>
              </button>

              {/* Comentarios */}
              <div className="flex flex-col items-center gap-1">
                <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] font-bold text-white drop-shadow">
                  {comments.length}
                </span>
              </div>

              {/* Compartir */}
              <div className="flex flex-col items-center gap-1">
                <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="font-mono text-[11px] font-bold text-white drop-shadow">
                  34
                </span>
              </div>
            </div>

            {/* Información del Partido en la base del Reel */}
            <div className="relative z-10 p-4 text-white space-y-1">
              <h3 className="font-black text-sm text-white drop-shadow">
                Partido Épico en Cancha Central
              </h3>
              <p className="text-xs text-white/90 drop-shadow">
                Golazo increíble en el último minuto
              </p>
              <div className="text-[11px] text-emerald-300 font-mono flex items-center gap-1 pt-1">
                <span>@Carlos_Futbol</span>
                <span>•</span>
                <span>Cancha Central Chillán</span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Feed de Comentarios (Imagen 4) */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-sm text-white">Comentarios</h4>
            <span className="text-xs font-mono text-slate-400">{comments.length} comentarios</span>
          </div>

          {/* Lista de Comentarios */}
          <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
            {comments.map(c => (
              <div key={c.id} className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">@{c.user}</span>
                  <span className="text-[10px] text-slate-500">{c.timeAgo}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{c.text}</p>
                <div className="text-[10px] text-slate-500 flex items-center gap-3 pt-0.5">
                  <button className="hover:text-emerald-400 cursor-pointer">Responder</button>
                  <span className="flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5" /> {c.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario Agregar Comentario */}
          <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Agrega un comentario..."
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#22c55e] placeholder-slate-500"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-slate-950 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
