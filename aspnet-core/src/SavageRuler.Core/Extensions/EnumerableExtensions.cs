using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Extensions
{
    public static class EnumerableExtensions
    {
        public static void AddMany<T>(this ICollection<T> collection, params T[] items)
        {
            if (collection == null)
                throw new ArgumentNullException(nameof(collection));
            if (items == null)
                throw new ArgumentNullException(nameof(items));

            if (collection is List<T> list)
            {
                list.AddRange(items);
                return;
            }

            foreach (var item in items)
            {
                collection.Add(item);
            }
        }
    }
}
