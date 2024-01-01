#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream inputFile("day12.in"); // Replace "input.txt" with your input file path

    if (!inputFile) {
        std::cerr << "Failed to open input file." << std::endl;
        return 1;
    }

    std::cout << "Input file successfully opened." << std::endl;

    std::string line;
    while (std::getline(inputFile, line)) {
        // Process each line of the input file here
        // ...

        // Example: Print each line
        std::cout << line << std::endl;
    }

    inputFile.close();

    return 0;
}
