#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <regex>
#include <cassert>
#include <chrono>
#include <unordered_map>
#include <deque>
#include <functional>

class LimitedMap {
public:
    LimitedMap(int limit) : limit(limit) {}

    void set(const std::string& key, const std::string& value) {
        if (map.count(key)) {
            map[key] = value;
            return;
        }
        if (keys.size() >= limit) {
            std::string keyToRemove = keys.front();
            map.erase(keyToRemove);
            keys.pop_front();
        }
        keys.push_back(key);
        map[key] = value;
    }

    std::string get(const std::string& key) {
        return map[key];
    }

    bool has(const std::string& key) {
        return map.count(key) > 0;
    }

private:
    int limit;
    std::unordered_map<std::string, std::string> map;
    std::deque<std::string> keys;
};

std::vector<int> countConsecutive(const std::string& trimmed, LimitedMap& countConsecutiveMem) {
    if (countConsecutiveMem.has(trimmed)) {
        std::vector<int> consecutive;
        std::istringstream iss(countConsecutiveMem.get(trimmed));
        int num;
        while (iss >> num) {
            consecutive.push_back(num);
        }
        return consecutive;
    }
    std::vector<int> consecutive;
    char last = '\0';
    for (char c : trimmed) {
        if (c == '#') {
            if (c == last) {
                consecutive.back()++;
            } else {
                consecutive.push_back(1);
            }
        }
        last = c;
    }
    std::ostringstream oss;
    for (int num : consecutive) {
        oss << num << ' ';
    }
    countConsecutiveMem.set(trimmed, oss.str());
    return consecutive;
}

int main() {
    std::ifstream inputFile("day12.in");
    std::stringstream input;
    input << inputFile.rdbuf();
    std::string example = R"(???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1)";

    std::string inputStr = input.str();
    bool useExample = false;
    if (useExample) {
        inputStr = example;
    }

    LimitedMap countConsecutiveMem(1000000);
    long long part1 = 0;
    std::istringstream iss(inputStr);
    std::string line;
    while (std::getline(iss, line)) {
        // std::cout << line << std::endl;
        std::istringstream lineStream(line);
        std::string spring, groupsStr;
        lineStream >> spring >> groupsStr;
        std::vector<int> groups;
        std::string group;
        std::istringstream groupsStream(groupsStr);
        while (std::getline(groupsStream, group, ',')) {
            groups.push_back(std::stoi(group));
        }

        int linePermutations = 0;
        std::vector<std::string> permutations;
        std::function<void(const std::string&, const std::string&)> permute = [&](const std::string& prefix, const std::string& suffix) {
            std::string trimmed = std::regex_replace(prefix, std::regex("^\\.+"), "");
            std::vector<int> consecutive = countConsecutive(trimmed, countConsecutiveMem);
            if (consecutive.size() > groups.size()) {
                return;
            }
            if (suffix.empty()) {
                if (consecutive.size() != groups.size()) {
                    return;
                }
                bool isValid = true;
                for (size_t i = 0; i < consecutive.size(); i++) {
                    if (consecutive[i] != groups[i]) {
                        isValid = false;
                        break;
                    }
                }
                if (isValid) {
                    part1++;
                    linePermutations++;
                }
                return;
            }
            if (suffix[0] == '?') {
                for (size_t i = 0; i < consecutive.size(); i++) {
                    int n = consecutive[i];
                    if (i < consecutive.size() - 1) {
                        if (n != groups[i]) {
                            return;
                        }
                    } else {
                        if (n < groups[i] && prefix.back() == '#') {
                            permute(prefix + '#', suffix.substr(1));
                            return;
                        } else if (n == groups[i] && prefix.back() == '#') {
                            permute(prefix + '.', suffix.substr(1));
                            return;
                        } else if (n > groups[i]) {
                            return;
                        }
                    }
                }
                permute(prefix + '.', suffix.substr(1));
                permute(prefix + '#', suffix.substr(1));
                return;
            }
            for (size_t i = 0; i < consecutive.size(); i++) {
                int n = consecutive[i];
                if (i < consecutive.size() - 1 && n != groups[i]) {
                    return;
                } else if (n < groups[i] && suffix[0] == '.') {
                    return;
                } else if (n > groups[i] && suffix[0] == '#') {
                    return;
                }
            }
            permute(prefix + suffix[0], suffix.substr(1));
        };
        permute("", spring);
    }

    std::cout << "Part 1: " << part1 << std::endl;

    return 0;
}
