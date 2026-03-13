import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function UserList({ users }) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_BASE}/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  // Sort users by registration date ASC (earliest first = S.No 1)
  const sortedUsers = [...users].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedUsers.map((user, index) => {
        const sno = index + 1  // S.No 1,2,3...
        return (
          <div key={user.id} className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
            {/* S.No Badge - Compact */}
            <div className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-md ring-2 ring-white/80 w-10 h-10 flex items-center justify-center">
              {sno}
            </div>
            
            {/* Content */}
            <div className="pt-12 pb-8 space-y-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900 text-base leading-tight line-clamp-1 group-hover:text-slate-700">
                  {user.name}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-1">{user.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="font-medium block text-slate-500 mb-0.5">Age</span>
                  <span className="font-bold text-slate-900 text-sm">{user.age}</span>
                </div>
                <div>
                  <span className="font-medium block text-slate-500 mb-0.5">Since</span>
                  <span className="font-semibold text-slate-800 text-xs">
                    {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-3 border-t border-slate-100 -mx-3 px-3">
              <Link
                to={`/users/${user.id}/edit`}
                className="flex-1 text-center py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteMutation.mutate(user.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 text-center py-2 px-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        )
      })}
      
      {sortedUsers.length === 0 && (
        <div className="col-span-full text-center py-16 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-xl flex items-center justify-center shadow-md">
            👥
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No customers</h3>
          <p className="text-sm text-slate-600 mb-6">Add customers to begin.</p>
          <Link to="/users/new" className="inline-flex px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all">
            Add Customer
          </Link>
        </div>
      )}
    </div>
  )
}

export default UserList

