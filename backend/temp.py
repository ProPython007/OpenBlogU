from sys import setrecursionlimit, stdin, stdout
from collections import defaultdict

setrecursionlimit(10**6)

def tarjans_scc(n, nominations):
    graph = defaultdict(list)
    for i in range(n):
        graph[i].append(nominations[i] - 1)

    # Tarjan's algorithm variables
    ids = [-1] * n  # Track ids of nodes
    low = [-1] * n  # Lowest reachable node
    on_stack = [False] * n  # Track nodes on the stack
    stack = []
    scc_count = 0
    current_id = 0
    max_bad_people = 0

    def dfs(at):
        nonlocal current_id, scc_count, max_bad_people
        stack.append(at)
        on_stack[at] = True
        ids[at] = low[at] = current_id
        current_id += 1

        # Visit neighbors
        for to in graph[at]:
            if ids[to] == -1:
                dfs(to)
                low[at] = min(low[at], low[to])
            elif on_stack[to]:
                low[at] = min(low[at], ids[to])

        # Start of an SCC
        if ids[at] == low[at]:
            scc_size = 0
            while True:
                node = stack.pop()
                on_stack[node] = False
                low[node] = ids[at]
                scc_size += 1
                if node == at:
                    break
            if scc_size > 1:
                max_bad_people += scc_size

    # Run DFS for each node
    for i in range(n):
        if ids[i] == -1:
            dfs(i)

    return max_bad_people

def main():
    T = int(stdin.readline().strip())
    results = []
    for _ in range(T):
        n = int(stdin.readline().strip())
        nominations = list(map(int, stdin.readline().strip().split()))
        result = tarjans_scc(n, nominations)
        results.append(result)

    stdout.write('\n'.join(map(str, results)) + '\n')

if __name__ == "__main__":
    main()
