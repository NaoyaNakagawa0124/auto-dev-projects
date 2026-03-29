/**
 * AniVote — Watch Party system.
 * Manages members, anime candidates, votes, and watch progress.
 */
(function (exports) {
  'use strict';

  const STORAGE_KEY = 'anivote_party';

  const STATUS = { CANDIDATE: 'candidate', WATCHING: 'watching', COMPLETED: 'completed', DROPPED: 'dropped' };

  function createParty(name, creatorName) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name || 'Watch Party',
      members: [{ name: creatorName || 'Host', joinedAt: new Date().toISOString() }],
      anime: [],
      createdAt: new Date().toISOString(),
    };
  }

  function addMember(party, memberName) {
    if (!memberName || party.members.some(m => m.name === memberName)) return party;
    party.members.push({ name: memberName, joinedAt: new Date().toISOString() });
    return party;
  }

  function removeMember(party, memberName) {
    party.members = party.members.filter(m => m.name !== memberName);
    // Remove their votes
    party.anime.forEach(a => { a.votes = a.votes.filter(v => v.member !== memberName); });
    return party;
  }

  function addAnime(party, title, episodes, genre, imageEmoji) {
    const anime = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: title,
      episodes: episodes || 12,
      genre: genre || 'Unknown',
      emoji: imageEmoji || '\uD83C\uDFAC',
      status: STATUS.CANDIDATE,
      votes: [],
      watchedEpisodes: 0,
      addedBy: party.members[0]?.name || 'Unknown',
      addedAt: new Date().toISOString(),
    };
    party.anime.push(anime);
    return party;
  }

  function removeAnime(party, animeId) {
    party.anime = party.anime.filter(a => a.id !== animeId);
    return party;
  }

  function vote(party, animeId, memberName, score) {
    const anime = party.anime.find(a => a.id === animeId);
    if (!anime) return party;
    score = Math.max(1, Math.min(5, score));
    const existing = anime.votes.find(v => v.member === memberName);
    if (existing) {
      existing.score = score;
    } else {
      anime.votes.push({ member: memberName, score: score });
    }
    return party;
  }

  function getVoteScore(anime) {
    if (anime.votes.length === 0) return 0;
    return anime.votes.reduce((s, v) => s + v.score, 0) / anime.votes.length;
  }

  function getMemberVote(anime, memberName) {
    const v = anime.votes.find(v => v.member === memberName);
    return v ? v.score : 0;
  }

  function setStatus(party, animeId, status) {
    const anime = party.anime.find(a => a.id === animeId);
    if (anime) anime.status = status;
    return party;
  }

  function incrementEpisode(party, animeId) {
    const anime = party.anime.find(a => a.id === animeId);
    if (anime && anime.watchedEpisodes < anime.episodes) {
      anime.watchedEpisodes++;
      if (anime.watchedEpisodes >= anime.episodes) {
        anime.status = STATUS.COMPLETED;
      }
    }
    return party;
  }

  function getCandidates(party) {
    return party.anime
      .filter(a => a.status === STATUS.CANDIDATE)
      .sort((a, b) => getVoteScore(b) - getVoteScore(a));
  }

  function getWatching(party) {
    return party.anime.filter(a => a.status === STATUS.WATCHING);
  }

  function getCompleted(party) {
    return party.anime.filter(a => a.status === STATUS.COMPLETED);
  }

  function getStats(party) {
    const total = party.anime.length;
    const candidates = party.anime.filter(a => a.status === STATUS.CANDIDATE).length;
    const watching = party.anime.filter(a => a.status === STATUS.WATCHING).length;
    const completed = party.anime.filter(a => a.status === STATUS.COMPLETED).length;
    const totalVotes = party.anime.reduce((s, a) => s + a.votes.length, 0);
    const totalEpisodes = party.anime.reduce((s, a) => s + a.watchedEpisodes, 0);
    return { total, candidates, watching, completed, totalVotes, totalEpisodes, members: party.members.length };
  }

  function saveParty(party) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(party));
  }

  function loadParty() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
  }

  function exportParty(party) {
    return btoa(encodeURIComponent(JSON.stringify(party)));
  }

  function importParty(encoded) {
    try { return JSON.parse(decodeURIComponent(atob(encoded))); } catch { return null; }
  }

  exports.STATUS = STATUS;
  exports.createParty = createParty;
  exports.addMember = addMember;
  exports.removeMember = removeMember;
  exports.addAnime = addAnime;
  exports.removeAnime = removeAnime;
  exports.vote = vote;
  exports.getVoteScore = getVoteScore;
  exports.getMemberVote = getMemberVote;
  exports.setStatus = setStatus;
  exports.incrementEpisode = incrementEpisode;
  exports.getCandidates = getCandidates;
  exports.getWatching = getWatching;
  exports.getCompleted = getCompleted;
  exports.getStats = getStats;
  exports.saveParty = saveParty;
  exports.loadParty = loadParty;
  exports.exportParty = exportParty;
  exports.importParty = importParty;

})(typeof window !== 'undefined' ? window : module.exports);
